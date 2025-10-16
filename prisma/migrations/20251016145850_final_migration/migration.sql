/*
  Warnings:

  - The values [SUPERADMIN,SPV,GM] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `role` ENUM('USER', 'ADMIN', 'MANAGER', 'INSPECTOR', 'VIEWER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `mall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `floor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `mall_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `floor_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_apar` VARCHAR(191) NOT NULL,
    `lantai` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `jenis` ENUM('CO2', 'POWDER', 'FOAM', 'AIR') NOT NULL,
    `size` DOUBLE NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `zone_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `apar_kode_apar_key`(`kode_apar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hydrant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_unik` VARCHAR(191) NOT NULL,
    `kode_hydrant` VARCHAR(191) NOT NULL,
    `ukuran` VARCHAR(191) NOT NULL,
    `lantai` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `zone_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hydrant_kode_unik_key`(`kode_unik`),
    UNIQUE INDEX `hydrant_kode_hydrant_key`(`kode_hydrant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_type` ENUM('APAR', 'HYDRANT') NOT NULL,
    `apar_id` INTEGER NULL,
    `hydrant_id` INTEGER NULL,
    `user_id` VARCHAR(191) NULL,
    `nama_petugas` VARCHAR(191) NULL,
    `regu` ENUM('PAGI', 'SIANG', 'MALAM', 'MIDDLE') NOT NULL DEFAULT 'PAGI',
    `result` ENUM('PASSED', 'FAILED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `photos` VARCHAR(191) NULL,
    `tanggal_inspeksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apar_inspection_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `apar_id` INTEGER NULL,
    `user_id` VARCHAR(191) NULL,
    `nama_petugas` VARCHAR(191) NULL,
    `regu` ENUM('PAGI', 'SIANG', 'MALAM', 'MIDDLE') NOT NULL DEFAULT 'PAGI',
    `tanggal_kadaluarsa` DATETIME(3) NULL,
    `tanggal_refill` DATETIME(3) NULL,
    `kondisi` VARCHAR(191) NULL,
    `catatan` VARCHAR(191) NULL,
    `foto_apar` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `apar_inspection_detail_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hydrant_inspection_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `hydrant_id` INTEGER NULL,
    `user_id` VARCHAR(191) NULL,
    `nama_petugas` VARCHAR(191) NULL,
    `regu` ENUM('PAGI', 'SIANG', 'MALAM', 'MIDDLE') NOT NULL DEFAULT 'PAGI',
    `valve_machino_coupling` VARCHAR(191) NULL,
    `fire_hose_machino_coupling` VARCHAR(191) NULL,
    `selang_hydrant` VARCHAR(191) NULL,
    `noozle_hydrant` VARCHAR(191) NULL,
    `kaca_box_hydrant` VARCHAR(191) NULL,
    `kunci_box_hydrant` VARCHAR(191) NULL,
    `box_hydrant` VARCHAR(191) NULL,
    `alarm` VARCHAR(191) NULL,
    `foto_hydrant` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `hydrant_inspection_detail_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NULL,
    `before` JSON NULL,
    `after` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Account_provider_providerAccountId_key` ON `Account`(`provider`, `providerAccountId`);

-- CreateIndex
CREATE UNIQUE INDEX `VerificationToken_identifier_token_key` ON `VerificationToken`(`identifier`, `token`);

-- AddForeignKey
ALTER TABLE `floor` ADD CONSTRAINT `floor_mall_id_fkey` FOREIGN KEY (`mall_id`) REFERENCES `mall`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `zone` ADD CONSTRAINT `zone_floor_id_fkey` FOREIGN KEY (`floor_id`) REFERENCES `floor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar` ADD CONSTRAINT `apar_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar` ADD CONSTRAINT `apar_zone_id_fkey` FOREIGN KEY (`zone_id`) REFERENCES `zone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant` ADD CONSTRAINT `hydrant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant` ADD CONSTRAINT `hydrant_zone_id_fkey` FOREIGN KEY (`zone_id`) REFERENCES `zone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_apar_id_fkey` FOREIGN KEY (`apar_id`) REFERENCES `apar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_hydrant_id_fkey` FOREIGN KEY (`hydrant_id`) REFERENCES `hydrant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspection` ADD CONSTRAINT `inspection_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar_inspection_detail` ADD CONSTRAINT `apar_inspection_detail_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar_inspection_detail` ADD CONSTRAINT `apar_inspection_detail_apar_id_fkey` FOREIGN KEY (`apar_id`) REFERENCES `apar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar_inspection_detail` ADD CONSTRAINT `apar_inspection_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant_inspection_detail` ADD CONSTRAINT `hydrant_inspection_detail_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant_inspection_detail` ADD CONSTRAINT `hydrant_inspection_detail_hydrant_id_fkey` FOREIGN KEY (`hydrant_id`) REFERENCES `hydrant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant_inspection_detail` ADD CONSTRAINT `hydrant_inspection_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit` ADD CONSTRAINT `audit_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
