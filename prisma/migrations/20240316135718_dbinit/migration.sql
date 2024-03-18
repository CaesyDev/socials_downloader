/*
  Warnings:

  - Added the required column `key` to the `apirequestcount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `apirequestcount` ADD COLUMN `key` VARCHAR(191) NOT NULL;
