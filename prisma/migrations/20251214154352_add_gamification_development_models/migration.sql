-- CreateTable
CREATE TABLE "UserGamification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "xpTotal" INTEGER NOT NULL DEFAULT 0,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "currentLevelXp" INTEGER NOT NULL DEFAULT 0,
    "nextLevelXpRequired" INTEGER NOT NULL DEFAULT 500,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" DATETIME,
    "modulesCompleted" INTEGER NOT NULL DEFAULT 0,
    "challengesCompleted" INTEGER NOT NULL DEFAULT 0,
    "collaborativeChallenges" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserGamification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "iconUrl" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "unlockCriteria" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gamificationId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserBadge_gamificationId_fkey" FOREIGN KEY ("gamificationId") REFERENCES "UserGamification" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DevelopmentModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "strengthKey" TEXT,
    "domainKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "moduleId" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Challenge_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "DevelopmentModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserModuleProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "completedChallenges" INTEGER NOT NULL DEFAULT 0,
    "totalChallenges" INTEGER NOT NULL,
    "moduleXpEarned" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserModuleProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "DevelopmentModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserChallengeProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserChallengeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserChallengeProgress_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CollaborativeChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "initiatorUserId" TEXT NOT NULL,
    "partnerUserId" TEXT NOT NULL,
    "initiatorCompleted" BOOLEAN NOT NULL DEFAULT false,
    "partnerCompleted" BOOLEAN NOT NULL DEFAULT false,
    "initiatorCompletedAt" DATETIME,
    "partnerCompletedAt" DATETIME,
    "xpBonusAwarded" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CollaborativeChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CollaborativeChallenge_initiatorUserId_fkey" FOREIGN KEY ("initiatorUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CollaborativeChallenge_partnerUserId_fkey" FOREIGN KEY ("partnerUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "strengthsHash" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGamification_userId_key" ON "UserGamification"("userId");

-- CreateIndex
CREATE INDEX "UserGamification_userId_idx" ON "UserGamification"("userId");

-- CreateIndex
CREATE INDEX "UserGamification_xpTotal_idx" ON "UserGamification"("xpTotal");

-- CreateIndex
CREATE INDEX "UserGamification_currentLevel_idx" ON "UserGamification"("currentLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_key_key" ON "Badge"("key");

-- CreateIndex
CREATE INDEX "Badge_key_idx" ON "Badge"("key");

-- CreateIndex
CREATE INDEX "Badge_tier_idx" ON "Badge"("tier");

-- CreateIndex
CREATE INDEX "UserBadge_gamificationId_idx" ON "UserBadge"("gamificationId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_gamificationId_badgeId_key" ON "UserBadge"("gamificationId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentModule_key_key" ON "DevelopmentModule"("key");

-- CreateIndex
CREATE INDEX "DevelopmentModule_strengthKey_idx" ON "DevelopmentModule"("strengthKey");

-- CreateIndex
CREATE INDEX "DevelopmentModule_domainKey_idx" ON "DevelopmentModule"("domainKey");

-- CreateIndex
CREATE INDEX "DevelopmentModule_level_idx" ON "DevelopmentModule"("level");

-- CreateIndex
CREATE INDEX "DevelopmentModule_order_idx" ON "DevelopmentModule"("order");

-- CreateIndex
CREATE INDEX "Challenge_moduleId_idx" ON "Challenge"("moduleId");

-- CreateIndex
CREATE INDEX "Challenge_type_idx" ON "Challenge"("type");

-- CreateIndex
CREATE INDEX "Challenge_order_idx" ON "Challenge"("order");

-- CreateIndex
CREATE INDEX "UserModuleProgress_userId_idx" ON "UserModuleProgress"("userId");

-- CreateIndex
CREATE INDEX "UserModuleProgress_moduleId_idx" ON "UserModuleProgress"("moduleId");

-- CreateIndex
CREATE INDEX "UserModuleProgress_status_idx" ON "UserModuleProgress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserModuleProgress_userId_moduleId_key" ON "UserModuleProgress"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "UserChallengeProgress_userId_idx" ON "UserChallengeProgress"("userId");

-- CreateIndex
CREATE INDEX "UserChallengeProgress_challengeId_idx" ON "UserChallengeProgress"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallengeProgress_userId_challengeId_key" ON "UserChallengeProgress"("userId", "challengeId");

-- CreateIndex
CREATE INDEX "CollaborativeChallenge_initiatorUserId_idx" ON "CollaborativeChallenge"("initiatorUserId");

-- CreateIndex
CREATE INDEX "CollaborativeChallenge_partnerUserId_idx" ON "CollaborativeChallenge"("partnerUserId");

-- CreateIndex
CREATE INDEX "CollaborativeChallenge_status_idx" ON "CollaborativeChallenge"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CollaborativeChallenge_challengeId_initiatorUserId_partnerUserId_key" ON "CollaborativeChallenge"("challengeId", "initiatorUserId", "partnerUserId");

-- CreateIndex
CREATE INDEX "UserRecommendation_userId_idx" ON "UserRecommendation"("userId");

-- CreateIndex
CREATE INDEX "UserRecommendation_expiresAt_idx" ON "UserRecommendation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecommendation_userId_recommendationType_key" ON "UserRecommendation"("userId", "recommendationType");
