# ============================================================
# Dockerfile متعدد المراحل — مستخدم غير root
# البناء: docker build -t aldawa-v2 .
# Railway: [build] builder=DOCKERFILE في railway.toml — app = CMD،
# وworker = نفس الـ image عبر railway.worker.toml (startCommand).
# ============================================================

FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# حماية: لو لم يصل مجلد public للريبو (رفع ناقص) لا يفشل البناء
RUN mkdir -p public
# env زائفة للبناء — فحص env وقت التشغيل فقط
ENV NODE_ENV=production
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache poppler-utils && addgroup -S aldawa && adduser -S aldawa -G aldawa
ENV NODE_ENV=production
ENV PORT=3000
# تبعيات الإنتاج كاملة من نفس الـ lockfile — تشمل تبعيات الـ worker
# (bullmq/ioredis/pino/nodemailer/zod/@prisma/client) وtsx/esbuild مع
# @esbuild/linux-x64 (tsx في dependencies) وأشجارها المتفرعة
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund
# Prisma CLI من مرحلة deps بنفس إصدار الـ lockfile — للـ preDeployCommand
# (migrate deploy) — بلا اعتماد على npx وقت التشغيل
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY --from=deps /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma/migrations ./prisma/migrations
# tsconfig للـ worker — tsx يقرأ paths "@/..." منه
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN mkdir -p uploads && chown -R aldawa:aldawa /app
USER aldawa
EXPOSE 3000
# Railway يمرر PORT ديناميكيًا — standalone يستمع على HOSTNAME:PORT
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
