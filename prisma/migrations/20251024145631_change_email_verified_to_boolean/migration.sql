/*
  Warnings:

  - The `emailVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `session` ADD COLUMN `impersonatedBy` TEXT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `banExpires` DATETIME(3) NULL,
    ADD COLUMN `banReason` TEXT NULL,
    ADD COLUMN `banned` BOOLEAN NULL DEFAULT false,
    DROP COLUMN `emailVerified`,
    ADD COLUMN `emailVerified` BOOLEAN NULL DEFAULT false;
