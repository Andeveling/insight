-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "career" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "description" TEXT,
    "hobbies" TEXT,
    "profileImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metaphor" TEXT NOT NULL,
    "keyQuestion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contributionToTeam" TEXT NOT NULL,
    "potentialPitfall" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Strength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "briefDefinition" TEXT NOT NULL,
    "fullDefinition" TEXT NOT NULL,
    "howToUseMoreEffectively" TEXT,
    "watchOuts" TEXT,
    "strengthsDynamics" TEXT,
    "bestPartners" TEXT,
    "careerApplications" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Strength_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStrength" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "strengthId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserStrength_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserStrength_strengthId_fkey" FOREIGN KEY ("strengthId") REFERENCES "Strength" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Focus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "axis" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DomainFocus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainId" TEXT NOT NULL,
    "focusId" TEXT NOT NULL,
    "weight" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DomainFocus_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DomainFocus_focusId_fkey" FOREIGN KEY ("focusId") REFERENCES "Focus" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Culture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "focusEnergyId" TEXT NOT NULL,
    "focusOrientationId" TEXT NOT NULL,
    "attributes" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Culture_focusEnergyId_fkey" FOREIGN KEY ("focusEnergyId") REFERENCES "Focus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Culture_focusOrientationId_fkey" FOREIGN KEY ("focusOrientationId") REFERENCES "Focus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "UserProfile_userId_idx" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "Team_name_idx" ON "Team"("name");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_userId_teamId_key" ON "TeamMember"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "Domain"("name");

-- CreateIndex
CREATE INDEX "Domain_name_idx" ON "Domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Strength_name_key" ON "Strength"("name");

-- CreateIndex
CREATE INDEX "Strength_domainId_idx" ON "Strength"("domainId");

-- CreateIndex
CREATE INDEX "Strength_name_idx" ON "Strength"("name");

-- CreateIndex
CREATE INDEX "UserStrength_userId_idx" ON "UserStrength"("userId");

-- CreateIndex
CREATE INDEX "UserStrength_strengthId_idx" ON "UserStrength"("strengthId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStrength_userId_strengthId_key" ON "UserStrength"("userId", "strengthId");

-- CreateIndex
CREATE UNIQUE INDEX "UserStrength_userId_rank_key" ON "UserStrength"("userId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "Focus_name_key" ON "Focus"("name");

-- CreateIndex
CREATE INDEX "Focus_name_idx" ON "Focus"("name");

-- CreateIndex
CREATE INDEX "Focus_axis_idx" ON "Focus"("axis");

-- CreateIndex
CREATE INDEX "DomainFocus_domainId_idx" ON "DomainFocus"("domainId");

-- CreateIndex
CREATE INDEX "DomainFocus_focusId_idx" ON "DomainFocus"("focusId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainFocus_domainId_focusId_key" ON "DomainFocus"("domainId", "focusId");

-- CreateIndex
CREATE UNIQUE INDEX "Culture_name_key" ON "Culture"("name");

-- CreateIndex
CREATE INDEX "Culture_name_idx" ON "Culture"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Culture_focusEnergyId_focusOrientationId_key" ON "Culture"("focusEnergyId", "focusOrientationId");
