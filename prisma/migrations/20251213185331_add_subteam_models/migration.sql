-- CreateTable
CREATE TABLE "SubTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentTeamId" TEXT NOT NULL,
    "projectTypeProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "members" TEXT NOT NULL,
    "matchScore" REAL,
    "analysis" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "SubTeam_parentTeamId_fkey" FOREIGN KEY ("parentTeamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SubTeam_projectTypeProfileId_fkey" FOREIGN KEY ("projectTypeProfileId") REFERENCES "ProjectTypeProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubTeam_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTypeProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "idealStrengths" TEXT NOT NULL,
    "criticalDomains" TEXT NOT NULL,
    "cultureFit" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "characteristics" TEXT,
    "characteristicsEs" TEXT,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "SubTeam_parentTeamId_deletedAt_idx" ON "SubTeam"("parentTeamId", "deletedAt");

-- CreateIndex
CREATE INDEX "SubTeam_createdBy_idx" ON "SubTeam"("createdBy");

-- CreateIndex
CREATE INDEX "SubTeam_projectTypeProfileId_idx" ON "SubTeam"("projectTypeProfileId");

-- CreateIndex
CREATE INDEX "SubTeam_status_idx" ON "SubTeam"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTypeProfile_type_key" ON "ProjectTypeProfile"("type");

-- CreateIndex
CREATE INDEX "ProjectTypeProfile_type_idx" ON "ProjectTypeProfile"("type");
