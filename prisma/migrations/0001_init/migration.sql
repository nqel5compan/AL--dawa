-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'DOCTOR', 'LAB', 'LAB_SUPERVISOR', 'ADMIN', 'MEDICAL_OFFICER');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('DATA_PROCESSING', 'AI_ANALYSIS', 'DOCTOR_SHARE', 'NOTIFICATIONS', 'RESEARCH', 'LAB_RESULT_SHARING');

-- CreateEnum
CREATE TYPE "LabOrderStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'RESULT_UPLOADED', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IdentityHoldStatus" AS ENUM ('OPEN', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReportSource" AS ENUM ('PATIENT_UPLOAD', 'LAB_DIRECT');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'RETIRED');

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "phoneVerifiedAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "labId" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'ar',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "gov" TEXT,
    "city" TEXT,
    "emergencyContact" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "bpSystolic" INTEGER,
    "bpDiastolic" INTEGER,
    "chronicConditions" TEXT NOT NULL DEFAULT '[]',
    "medications" TEXT NOT NULL DEFAULT '[]',
    "allergies" TEXT NOT NULL DEFAULT '[]',
    "surgeries" TEXT NOT NULL DEFAULT '[]',
    "smokingStatus" TEXT,
    "quitYearsAgo" INTEGER,
    "activityLevel" TEXT,
    "familyHistory" TEXT NOT NULL DEFAULT '[]',
    "personalCancerHistory" BOOLEAN NOT NULL DEFAULT false,
    "geneticRiskFactors" TEXT NOT NULL DEFAULT '[]',
    "reproductiveInfo" TEXT NOT NULL DEFAULT '{}',
    "completion" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "bio" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DoctorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ConsentType" NOT NULL,
    "source" TEXT,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "withdrawnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "healthData" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Markaz" (
    "id" TEXT NOT NULL,
    "gov" TEXT NOT NULL DEFAULT 'سوهاج',
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Markaz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "markazId" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "pricingModel" TEXT NOT NULL DEFAULT 'NONE',
    "pricePerResult" DOUBLE PRECISION,
    "commissionPct" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "status" "LabOrderStatus" NOT NULL DEFAULT 'CREATED',
    "patientId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "testKeys" TEXT NOT NULL DEFAULT '[]',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityHold" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "reportId" TEXT,
    "orderNumber" TEXT,
    "expectedName" TEXT NOT NULL,
    "providedName" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'NAME_MISMATCH',
    "status" "IdentityHoldStatus" NOT NULL DEFAULT 'OPEN',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdentityHold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingLabResult" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "phoneHash" TEXT,
    "patientName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL DEFAULT 'LAB',
    "labReportNo" TEXT,
    "testDate" TIMESTAMP(3),
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "claimToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "claimedUserId" TEXT,
    "claimedReportId" TEXT,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingLabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "noteAr" TEXT,
    "noteEn" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "FollowUpPlan" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "reportId" TEXT,
    "testKey" TEXT,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT,
    "dueDate" TIMESTAMP(3),
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportCorrection" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "valueId" TEXT,
    "field" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalReport" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "familyMemberId" TEXT,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL DEFAULT 'LAB',
    "labName" TEXT,
    "testDate" TIMESTAMP(3),
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UPLOADED',
    "source" "ReportSource" NOT NULL DEFAULT 'PATIENT_UPLOAD',
    "labId" TEXT,
    "labOrderId" TEXT,
    "labReportNo" TEXT,
    "issuedAt" TIMESTAMP(3),
    "labVerifiedById" TEXT,
    "labVerifiedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "patientOpenedAt" TIMESTAMP(3),
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "processingStep" TEXT,
    "extractionMeta" TEXT NOT NULL DEFAULT '{}',
    "assignedDoctorId" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportVersion" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "valuesJson" TEXT NOT NULL DEFAULT '[]',
    "changeNote" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedValue" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "canonicalKey" TEXT,
    "rawName" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "valueText" TEXT,
    "unit" TEXT,
    "refLow" DOUBLE PRECISION,
    "refHigh" DOUBLE PRECISION,
    "refText" TEXT,
    "flag" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verification" TEXT NOT NULL DEFAULT 'PENDING',
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "section" TEXT,
    "notes" TEXT,
    "testDate" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtractedValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCatalog" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "refLow" DOUBLE PRECISION,
    "refHigh" DOUBLE PRECISION,
    "refNoteAr" TEXT,
    "refNoteEn" TEXT,
    "category" TEXT NOT NULL,
    "genderSpecific" TEXT,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TestCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CriticalRule" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "testKey" TEXT NOT NULL,
    "op" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "severity" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "messageAr" TEXT NOT NULL,
    "messageEn" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CriticalRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningProtocol" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summaryAr" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gender" TEXT,
    "minAge" INTEGER NOT NULL DEFAULT 18,
    "maxAge" INTEGER,
    "intervalMonths" INTEGER,
    "riskFactors" TEXT NOT NULL DEFAULT '[]',
    "requiresRisk" BOOLEAN NOT NULL DEFAULT false,
    "testKeys" TEXT NOT NULL DEFAULT '[]',
    "protocolType" TEXT NOT NULL DEFAULT 'SCREENING',
    "exclusionsAr" TEXT,
    "exclusionsEn" TEXT,
    "seeDoctorAr" TEXT,
    "seeDoctorEn" TEXT,
    "sourceOrg" TEXT NOT NULL,
    "guidelineVersion" TEXT NOT NULL,
    "guidelineDate" TEXT NOT NULL,
    "doctorDiscussion" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScreeningProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreeningRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyMemberId" TEXT,
    "protocolId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "eligible" BOOLEAN NOT NULL DEFAULT true,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "lastDoneAt" TIMESTAMP(3),
    "nextDueAt" TIMESTAMP(3),
    "reasonAr" TEXT,
    "reasonEn" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slotKey" TEXT NOT NULL DEFAULT 'main',

    CONSTRAINT "ScreeningRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolReview" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "officerName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "note" TEXT,
    "snapshot" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProtocolReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolVersion" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" TEXT NOT NULL,
    "publishedById" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "ProtocolVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFactorAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factors" TEXT NOT NULL DEFAULT '[]',
    "factorsCount" INTEGER NOT NULL DEFAULT 0,
    "engineVersion" TEXT NOT NULL DEFAULT '2',
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFactorAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeSource" (
    "id" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT,
    "url" TEXT,
    "version" TEXT,
    "publishedAt" TEXT,
    "notesAr" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorReview" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "urgency" TEXT NOT NULL DEFAULT 'ROUTINE',
    "notes" TEXT,
    "recommendation" TEXT,
    "requestedInfo" TEXT,
    "corrections" TEXT NOT NULL DEFAULT '[]',
    "log" TEXT NOT NULL DEFAULT '[]',
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DoctorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CriticalAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportId" TEXT,
    "extractedValueId" TEXT,
    "ruleKey" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "messageAr" TEXT NOT NULL,
    "messageEn" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "CriticalAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "bodyAr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "channel" TEXT NOT NULL DEFAULT 'IN_APP',
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planKey" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "reportsUsed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "key" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "priceEgp" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reportsLimit" INTEGER NOT NULL DEFAULT 3,
    "featuresAr" TEXT NOT NULL DEFAULT '[]',
    "featuresEn" TEXT NOT NULL DEFAULT '[]',
    "includesReview" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "planKey" TEXT,
    "method" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'PAID',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "agentKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "provider" TEXT NOT NULL DEFAULT 'builtin',
    "inputSummary" TEXT,
    "outputSummary" TEXT,
    "tokens" INTEGER,
    "durationMs" INTEGER,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "meta" TEXT NOT NULL DEFAULT '{}',
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainEvent" (
    "seq" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reportId" TEXT,
    "patientId" TEXT,
    "labId" TEXT,
    "doctorId" TEXT,
    "orderId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "payload" TEXT NOT NULL DEFAULT '{}',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "DomainEvent_pkey" PRIMARY KEY ("seq")
);

-- CreateTable
CREATE TABLE "DashboardStat" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "uploads" INTEGER NOT NULL DEFAULT 0,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "corrections" INTEGER NOT NULL DEFAULT 0,
    "critical" INTEGER NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_labId_idx" ON "User"("labId");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_userId_key" ON "PatientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProfile_userId_key" ON "DoctorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_userId_type_key" ON "Consent"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_orderNumber_key" ON "LabOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LabOrder_qrToken_key" ON "LabOrder"("qrToken");

-- CreateIndex
CREATE INDEX "LabOrder_labId_status_createdAt_idx" ON "LabOrder"("labId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "LabOrder_patientId_createdAt_idx" ON "LabOrder"("patientId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "IdentityHold_labId_status_createdAt_idx" ON "IdentityHold"("labId", "status", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "PendingLabResult_claimToken_key" ON "PendingLabResult"("claimToken");

-- CreateIndex
CREATE INDEX "PendingLabResult_labId_status_createdAt_idx" ON "PendingLabResult"("labId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "PendingLabResult_phoneHash_status_idx" ON "PendingLabResult"("phoneHash", "status");

-- CreateIndex
CREATE INDEX "PendingLabResult_status_expiresAt_idx" ON "PendingLabResult"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "FollowUpPlan_patientId_status_idx" ON "FollowUpPlan"("patientId", "status");

-- CreateIndex
CREATE INDEX "ReportCorrection_labId_status_createdAt_idx" ON "ReportCorrection"("labId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ReportCorrection_reportId_idx" ON "ReportCorrection"("reportId");

-- CreateIndex
CREATE INDEX "MedicalReport_ownerUserId_uploadedAt_idx" ON "MedicalReport"("ownerUserId", "uploadedAt" DESC);

-- CreateIndex
CREATE INDEX "MedicalReport_labId_source_uploadedAt_idx" ON "MedicalReport"("labId", "source", "uploadedAt" DESC);

-- CreateIndex
CREATE INDEX "MedicalReport_assignedDoctorId_status_uploadedAt_idx" ON "MedicalReport"("assignedDoctorId", "status", "uploadedAt" DESC);

-- CreateIndex
CREATE INDEX "MedicalReport_status_uploadedAt_idx" ON "MedicalReport"("status", "uploadedAt" DESC);

-- CreateIndex
CREATE INDEX "ReportVersion_reportId_version_idx" ON "ReportVersion"("reportId", "version" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ReportVersion_reportId_version_key" ON "ReportVersion"("reportId", "version");

-- CreateIndex
CREATE INDEX "ExtractedValue_reportId_idx" ON "ExtractedValue"("reportId");

-- CreateIndex
CREATE INDEX "ExtractedValue_canonicalKey_testDate_idx" ON "ExtractedValue"("canonicalKey", "testDate" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "TestCatalog_key_key" ON "TestCatalog"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CriticalRule_key_key" ON "CriticalRule"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ScreeningProtocol_key_key" ON "ScreeningProtocol"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ScreeningRecord_userId_protocolId_slotKey_key" ON "ScreeningRecord"("userId", "protocolId", "slotKey");

-- CreateIndex
CREATE INDEX "ProtocolReview_protocolId_createdAt_idx" ON "ProtocolReview"("protocolId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ProtocolVersion_protocolId_version_idx" ON "ProtocolVersion"("protocolId", "version" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolVersion_protocolId_version_key" ON "ProtocolVersion"("protocolId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "RiskFactorAssessment_userId_key" ON "RiskFactorAssessment"("userId");

-- CreateIndex
CREATE INDEX "DoctorReview_doctorId_status_createdAt_idx" ON "DoctorReview"("doctorId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "DoctorReview_status_urgency_createdAt_idx" ON "DoctorReview"("status", "urgency", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "CriticalAlert_userId_status_createdAt_idx" ON "CriticalAlert"("userId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Notification_userId_type_createdAt_idx" ON "Notification"("userId", "type", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_planKey_status_idx" ON "Subscription"("planKey", "status");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "Payment"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ChatMessage_userId_createdAt_idx" ON "ChatMessage"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "DomainEvent_id_key" ON "DomainEvent"("id");

-- CreateIndex
CREATE INDEX "DomainEvent_publishedAt_occurredAt_idx" ON "DomainEvent"("publishedAt", "occurredAt" DESC);

-- CreateIndex
CREATE INDEX "DomainEvent_reportId_occurredAt_idx" ON "DomainEvent"("reportId", "occurredAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardStat_scope_scopeId_day_key" ON "DashboardStat"("scope", "scopeId", "day");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientProfile" ADD CONSTRAINT "PatientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorProfile" ADD CONSTRAINT "DoctorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lab" ADD CONSTRAINT "Lab_markazId_fkey" FOREIGN KEY ("markazId") REFERENCES "Markaz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdentityHold" ADD CONSTRAINT "IdentityHold_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingLabResult" ADD CONSTRAINT "PendingLabResult_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpPlan" ADD CONSTRAINT "FollowUpPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpPlan" ADD CONSTRAINT "FollowUpPlan_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCorrection" ADD CONSTRAINT "ReportCorrection_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MedicalReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportCorrection" ADD CONSTRAINT "ReportCorrection_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_labOrderId_fkey" FOREIGN KEY ("labOrderId") REFERENCES "LabOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalReport" ADD CONSTRAINT "MedicalReport_assignedDoctorId_fkey" FOREIGN KEY ("assignedDoctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportVersion" ADD CONSTRAINT "ReportVersion_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MedicalReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedValue" ADD CONSTRAINT "ExtractedValue_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MedicalReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningRecord" ADD CONSTRAINT "ScreeningRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningRecord" ADD CONSTRAINT "ScreeningRecord_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreeningRecord" ADD CONSTRAINT "ScreeningRecord_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "ScreeningProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolReview" ADD CONSTRAINT "ProtocolReview_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "ScreeningProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolVersion" ADD CONSTRAINT "ProtocolVersion_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "ScreeningProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorReview" ADD CONSTRAINT "DoctorReview_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MedicalReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorReview" ADD CONSTRAINT "DoctorReview_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriticalAlert" ADD CONSTRAINT "CriticalAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriticalAlert" ADD CONSTRAINT "CriticalAlert_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MedicalReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiInteraction" ADD CONSTRAINT "AiInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

