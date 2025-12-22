-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phase" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "scaleRange" TEXT,
    "domainId" TEXT NOT NULL,
    "strengthId" TEXT,
    "weight" REAL NOT NULL DEFAULT 1.0,
    "maturityPolarity" TEXT NOT NULL DEFAULT 'NEUTRAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentQuestion_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AssessmentQuestion_strengthId_fkey" FOREIGN KEY ("strengthId") REFERENCES "Strength" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentQuestion" ("createdAt", "domainId", "id", "options", "order", "phase", "scaleRange", "strengthId", "text", "type", "updatedAt", "weight") SELECT "createdAt", "domainId", "id", "options", "order", "phase", "scaleRange", "strengthId", "text", "type", "updatedAt", "weight" FROM "AssessmentQuestion";
DROP TABLE "AssessmentQuestion";
ALTER TABLE "new_AssessmentQuestion" RENAME TO "AssessmentQuestion";
CREATE INDEX "AssessmentQuestion_phase_idx" ON "AssessmentQuestion"("phase");
CREATE INDEX "AssessmentQuestion_domainId_idx" ON "AssessmentQuestion"("domainId");
CREATE INDEX "AssessmentQuestion_strengthId_idx" ON "AssessmentQuestion"("strengthId");
CREATE UNIQUE INDEX "AssessmentQuestion_phase_order_key" ON "AssessmentQuestion"("phase", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
