-- CreateTable
CREATE TABLE "UserDNA" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "synergies" TEXT NOT NULL,
    "idealRole" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserDNA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDNA_userId_key" ON "UserDNA"("userId");

-- CreateIndex
CREATE INDEX "UserDNA_userId_idx" ON "UserDNA"("userId");
