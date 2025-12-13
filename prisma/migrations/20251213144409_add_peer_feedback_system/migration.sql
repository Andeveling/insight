-- CreateTable
CREATE TABLE "FeedbackRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "respondentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedbackRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeedbackRequest_respondentId_fkey" FOREIGN KEY ("respondentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedbackQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "answerType" TEXT NOT NULL,
    "answerOptions" TEXT NOT NULL,
    "strengthMapping" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FeedbackResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "anonymousHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeedbackResponse_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FeedbackRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeedbackResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FeedbackQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedbackSummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalResponses" INTEGER NOT NULL DEFAULT 0,
    "lastResponseAt" DATETIME,
    "strengthAdjustments" TEXT NOT NULL,
    "insights" TEXT,
    "insightsGeneratedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeedbackSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StrengthAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "strengthId" TEXT NOT NULL,
    "suggestedDelta" REAL NOT NULL,
    "supportingData" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    CONSTRAINT "StrengthAdjustment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StrengthAdjustment_strengthId_fkey" FOREIGN KEY ("strengthId") REFERENCES "Strength" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FeedbackRequest_respondentId_status_idx" ON "FeedbackRequest"("respondentId", "status");

-- CreateIndex
CREATE INDEX "FeedbackRequest_requesterId_idx" ON "FeedbackRequest"("requesterId");

-- CreateIndex
CREATE INDEX "FeedbackRequest_expiresAt_idx" ON "FeedbackRequest"("expiresAt");

-- CreateIndex
CREATE INDEX "FeedbackRequest_status_idx" ON "FeedbackRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackRequest_requesterId_respondentId_sentAt_key" ON "FeedbackRequest"("requesterId", "respondentId", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackQuestion_order_key" ON "FeedbackQuestion"("order");

-- CreateIndex
CREATE INDEX "FeedbackQuestion_order_idx" ON "FeedbackQuestion"("order");

-- CreateIndex
CREATE INDEX "FeedbackResponse_requestId_idx" ON "FeedbackResponse"("requestId");

-- CreateIndex
CREATE INDEX "FeedbackResponse_anonymousHash_idx" ON "FeedbackResponse"("anonymousHash");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackResponse_requestId_questionId_key" ON "FeedbackResponse"("requestId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackSummary_userId_key" ON "FeedbackSummary"("userId");

-- CreateIndex
CREATE INDEX "FeedbackSummary_userId_idx" ON "FeedbackSummary"("userId");

-- CreateIndex
CREATE INDEX "FeedbackSummary_lastResponseAt_idx" ON "FeedbackSummary"("lastResponseAt");

-- CreateIndex
CREATE INDEX "StrengthAdjustment_userId_status_idx" ON "StrengthAdjustment"("userId", "status");

-- CreateIndex
CREATE INDEX "StrengthAdjustment_strengthId_idx" ON "StrengthAdjustment"("strengthId");

-- CreateIndex
CREATE UNIQUE INDEX "StrengthAdjustment_userId_strengthId_createdAt_key" ON "StrengthAdjustment"("userId", "strengthId", "createdAt");
