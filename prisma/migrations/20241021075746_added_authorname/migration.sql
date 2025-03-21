/*
  Warnings:

  - Made the column `authorName` on table `Blog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "authorName" SET NOT NULL,
ALTER COLUMN "authorName" SET DEFAULT 'Unknown';
