/*
  Warnings:

  - Added the required column `dateTime` to the `webvisit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `webvisit` ADD COLUMN `dateTime` VARCHAR(191) NOT NULL;
