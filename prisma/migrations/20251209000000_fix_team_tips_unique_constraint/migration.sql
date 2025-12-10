/*
  Warnings:

  - A unique constraint covering the columns `[type,userId,teamId]` on the table `Report` will be added. If there are existing duplicate entries, this will fail.
  - The unique constraint `Report_type_userId_key` will be removed.
  - The unique constraint `Report_type_teamId_key` will be removed.

*/
-- DropIndex
DROP INDEX "Report_type_userId_key";

-- DropIndex
DROP INDEX "Report_type_teamId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Report_type_userId_teamId_key" ON "Report"("type", "userId", "teamId");
