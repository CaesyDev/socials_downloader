/*
  Warnings:

  - Added the required column `os` to the `webvisit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `webvisit` ADD COLUMN `os` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `apikeys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `avaliable` BOOLEAN NOT NULL,
    `nextAvaliable` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
