/*
  Warnings:

  - You are about to drop the column `Session_state` on the `Account` table. All the data in the column will be lost.
  - The `expires_at` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `SessionToken` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionToken]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionToken` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_SessionToken_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "Session_state",
ADD COLUMN     "session_state" TEXT,
DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" INTEGER;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "SessionToken",
ADD COLUMN     "sessionToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
