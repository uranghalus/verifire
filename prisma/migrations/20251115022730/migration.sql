/*
  Warnings:

  - The primary key for the `apar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `apar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `jenis` on the `apar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - The primary key for the `apar_inspections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `apar_inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `aparId` on the `apar_inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `regu` on the `apar_inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - The primary key for the `hydrant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `hydrant` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `hydrant_inspections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `hydrant_inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `hydrantId` on the `hydrant_inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `regu` on the `hydrant_inspections` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- DropForeignKey
ALTER TABLE `apar_inspections` DROP FOREIGN KEY `apar_inspections_aparId_fkey`;

-- DropForeignKey
ALTER TABLE `hydrant_inspections` DROP FOREIGN KEY `hydrant_inspections_hydrantId_fkey`;

-- DropIndex
DROP INDEX `apar_inspections_aparId_fkey` ON `apar_inspections`;

-- DropIndex
DROP INDEX `hydrant_inspections_hydrantId_fkey` ON `hydrant_inspections`;

-- AlterTable
ALTER TABLE `apar` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `lantai` VARCHAR(255) NULL,
    MODIFY `jenis` ENUM('CO2', 'Powder', 'Foam', 'Air') NOT NULL,
    MODIFY `size` DECIMAL(3, 1) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `apar_inspections` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `aparId` INTEGER NULL,
    MODIFY `regu` ENUM('PAGI', 'SIANG', 'MALAM', 'MIDDLE') NOT NULL DEFAULT 'PAGI',
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `hydrant` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `hydrant_inspections` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `hydrantId` INTEGER NULL,
    MODIFY `regu` ENUM('PAGI', 'SIANG', 'MALAM', 'MIDDLE') NOT NULL DEFAULT 'PAGI',
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `apar_inspections` ADD CONSTRAINT `apar_inspections_aparId_fkey` FOREIGN KEY (`aparId`) REFERENCES `apar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant_inspections` ADD CONSTRAINT `hydrant_inspections_hydrantId_fkey` FOREIGN KEY (`hydrantId`) REFERENCES `hydrant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
