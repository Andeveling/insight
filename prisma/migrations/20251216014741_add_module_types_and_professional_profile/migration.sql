-- CreateTable
CREATE TABLE "UserProfessionalProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "roleStatus" TEXT NOT NULL DEFAULT 'neutral',
    "currentRole" TEXT,
    "industryContext" TEXT,
    "careerGoals" TEXT,
    "completedAt" DATETIME,
    "skippedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DevelopmentModule" (
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
    "moduleType" TEXT NOT NULL DEFAULT 'general',
    "userId" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "generatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DevelopmentModule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DevelopmentModule" ("content", "createdAt", "descriptionEs", "domainKey", "estimatedMinutes", "id", "isActive", "key", "level", "order", "strengthKey", "titleEs", "updatedAt", "xpReward") SELECT "content", "createdAt", "descriptionEs", "domainKey", "estimatedMinutes", "id", "isActive", "key", "level", "order", "strengthKey", "titleEs", "updatedAt", "xpReward" FROM "DevelopmentModule";
DROP TABLE "DevelopmentModule";
ALTER TABLE "new_DevelopmentModule" RENAME TO "DevelopmentModule";
CREATE UNIQUE INDEX "DevelopmentModule_key_key" ON "DevelopmentModule"("key");
CREATE INDEX "DevelopmentModule_strengthKey_idx" ON "DevelopmentModule"("strengthKey");
CREATE INDEX "DevelopmentModule_domainKey_idx" ON "DevelopmentModule"("domainKey");
CREATE INDEX "DevelopmentModule_level_idx" ON "DevelopmentModule"("level");
CREATE INDEX "DevelopmentModule_order_idx" ON "DevelopmentModule"("order");
CREATE INDEX "DevelopmentModule_moduleType_strengthKey_idx" ON "DevelopmentModule"("moduleType", "strengthKey");
CREATE INDEX "DevelopmentModule_userId_moduleType_idx" ON "DevelopmentModule"("userId", "moduleType");
CREATE INDEX "DevelopmentModule_isArchived_idx" ON "DevelopmentModule"("isArchived");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfessionalProfile_userId_key" ON "UserProfessionalProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfessionalProfile_userId_idx" ON "UserProfessionalProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfessionalProfile_roleStatus_idx" ON "UserProfessionalProfile"("roleStatus");
