-- CreateTable
CREATE TABLE "XpTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "streakBonus" REAL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "XpTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "XpTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserGamification" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "XpTransaction_userId_createdAt_idx" ON "XpTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "XpTransaction_source_idx" ON "XpTransaction"("source");

-- CreateIndex
CREATE INDEX "XpTransaction_sourceId_idx" ON "XpTransaction"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "XpTransaction_userId_source_sourceId_key" ON "XpTransaction"("userId", "source", "sourceId");
