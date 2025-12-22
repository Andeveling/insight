-- CreateTable
CREATE TABLE "MaturityLevelDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "minXp" INTEGER NOT NULL,
    "maxXp" INTEGER,
    "color" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StrengthMaturityLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "strengthId" TEXT NOT NULL,
    "currentXp" INTEGER NOT NULL DEFAULT 0,
    "currentLevel" TEXT NOT NULL DEFAULT 'SPONGE',
    "lastXpGain" DATETIME,
    "lastLevelUp" DATETIME,
    "totalXpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StrengthMaturityLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StrengthMaturityLevel_strengthId_fkey" FOREIGN KEY ("strengthId") REFERENCES "Strength" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ComboBreaker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredCount" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 100,
    "cooldownHours" INTEGER NOT NULL DEFAULT 72,
    "icon" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ComboStrength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comboBreakerId" TEXT NOT NULL,
    "strengthId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ComboStrength_comboBreakerId_fkey" FOREIGN KEY ("comboBreakerId") REFERENCES "ComboBreaker" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ComboStrength_strengthId_fkey" FOREIGN KEY ("strengthId") REFERENCES "Strength" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "strengthId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "cooldownHours" INTEGER,
    "requiresPartner" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quest_strengthId_fkey" FOREIGN KEY ("strengthId") REFERENCES "Strength" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "expiresAt" DATETIME,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "partnerId" TEXT,
    "confirmedAt" DATETIME,
    "confirmedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuestCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestCompletion_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestCompletion_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuestCompletion_confirmedBy_fkey" FOREIGN KEY ("confirmedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MaturityLevelDefinition_level_key" ON "MaturityLevelDefinition"("level");

-- CreateIndex
CREATE INDEX "MaturityLevelDefinition_level_idx" ON "MaturityLevelDefinition"("level");

-- CreateIndex
CREATE INDEX "StrengthMaturityLevel_userId_idx" ON "StrengthMaturityLevel"("userId");

-- CreateIndex
CREATE INDEX "StrengthMaturityLevel_strengthId_idx" ON "StrengthMaturityLevel"("strengthId");

-- CreateIndex
CREATE INDEX "StrengthMaturityLevel_currentLevel_idx" ON "StrengthMaturityLevel"("currentLevel");

-- CreateIndex
CREATE UNIQUE INDEX "StrengthMaturityLevel_userId_strengthId_key" ON "StrengthMaturityLevel"("userId", "strengthId");

-- CreateIndex
CREATE INDEX "ComboBreaker_requiredCount_idx" ON "ComboBreaker"("requiredCount");

-- CreateIndex
CREATE INDEX "ComboBreaker_isActive_idx" ON "ComboBreaker"("isActive");

-- CreateIndex
CREATE INDEX "ComboStrength_comboBreakerId_idx" ON "ComboStrength"("comboBreakerId");

-- CreateIndex
CREATE INDEX "ComboStrength_strengthId_idx" ON "ComboStrength"("strengthId");

-- CreateIndex
CREATE UNIQUE INDEX "ComboStrength_comboBreakerId_strengthId_key" ON "ComboStrength"("comboBreakerId", "strengthId");

-- CreateIndex
CREATE INDEX "Quest_type_idx" ON "Quest"("type");

-- CreateIndex
CREATE INDEX "Quest_strengthId_idx" ON "Quest"("strengthId");

-- CreateIndex
CREATE INDEX "Quest_isActive_idx" ON "Quest"("isActive");

-- CreateIndex
CREATE INDEX "Quest_difficulty_idx" ON "Quest"("difficulty");

-- CreateIndex
CREATE INDEX "QuestCompletion_userId_idx" ON "QuestCompletion"("userId");

-- CreateIndex
CREATE INDEX "QuestCompletion_questId_idx" ON "QuestCompletion"("questId");

-- CreateIndex
CREATE INDEX "QuestCompletion_status_idx" ON "QuestCompletion"("status");

-- CreateIndex
CREATE INDEX "QuestCompletion_partnerId_idx" ON "QuestCompletion"("partnerId");

-- CreateIndex
CREATE INDEX "QuestCompletion_expiresAt_idx" ON "QuestCompletion"("expiresAt");
