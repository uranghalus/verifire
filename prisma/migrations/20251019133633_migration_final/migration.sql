/*
  Warnings:

  - You are about to drop the `apar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `apar_inspection_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `floor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hydrant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hydrant_inspection_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inspection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mall` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zone` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `apar` DROP FOREIGN KEY `apar_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `apar` DROP FOREIGN KEY `apar_zone_id_fkey`;

-- DropForeignKey
ALTER TABLE `apar_inspection_detail` DROP FOREIGN KEY `apar_inspection_detail_apar_id_fkey`;

-- DropForeignKey
ALTER TABLE `apar_inspection_detail` DROP FOREIGN KEY `apar_inspection_detail_inspection_id_fkey`;

-- DropForeignKey
ALTER TABLE `apar_inspection_detail` DROP FOREIGN KEY `apar_inspection_detail_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `audit` DROP FOREIGN KEY `audit_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `floor` DROP FOREIGN KEY `floor_mall_id_fkey`;

-- DropForeignKey
ALTER TABLE `hydrant` DROP FOREIGN KEY `hydrant_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `hydrant` DROP FOREIGN KEY `hydrant_zone_id_fkey`;

-- DropForeignKey
ALTER TABLE `hydrant_inspection_detail` DROP FOREIGN KEY `hydrant_inspection_detail_hydrant_id_fkey`;

-- DropForeignKey
ALTER TABLE `hydrant_inspection_detail` DROP FOREIGN KEY `hydrant_inspection_detail_inspection_id_fkey`;

-- DropForeignKey
ALTER TABLE `hydrant_inspection_detail` DROP FOREIGN KEY `hydrant_inspection_detail_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `inspection` DROP FOREIGN KEY `inspection_apar_id_fkey`;

-- DropForeignKey
ALTER TABLE `inspection` DROP FOREIGN KEY `inspection_hydrant_id_fkey`;

-- DropForeignKey
ALTER TABLE `inspection` DROP FOREIGN KEY `inspection_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `zone` DROP FOREIGN KEY `zone_floor_id_fkey`;

-- DropTable
DROP TABLE `apar`;

-- DropTable
DROP TABLE `apar_inspection_detail`;

-- DropTable
DROP TABLE `audit`;

-- DropTable
DROP TABLE `floor`;

-- DropTable
DROP TABLE `hydrant`;

-- DropTable
DROP TABLE `hydrant_inspection_detail`;

-- DropTable
DROP TABLE `inspection`;

-- DropTable
DROP TABLE `mall`;

-- DropTable
DROP TABLE `notification`;

-- DropTable
DROP TABLE `zone`;

-- CreateTable
CREATE TABLE `Apar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_apar` VARCHAR(191) NOT NULL,
    `lantai` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `jenis` ENUM('CO2', 'POWDER', 'FOAM', 'AIR') NOT NULL,
    `size` DOUBLE NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Apar_kode_apar_key`(`kode_apar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hydrant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode_unik` VARCHAR(191) NOT NULL,
    `kode_hydrant` VARCHAR(191) NOT NULL,
    `ukuran` VARCHAR(191) NOT NULL,
    `lantai` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Hydrant_kode_unik_key`(`kode_unik`),
    UNIQUE INDEX `Hydrant_kode_hydrant_key`(`kode_hydrant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inspection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `device_type` ENUM('APAR', 'HYDRANT') NOT NULL,
    `apar_id` INTEGER NULL,
    `hydrant_id` INTEGER NULL,
    `user_id` VARCHAR(191) NULL,
    `nama_petugas` VARCHAR(191) NULL,
    `regu` ENUM('PAGI', 'SIANG', 'MALAM', 'MIDDLE') NOT NULL DEFAULT 'PAGI',
    `result` ENUM('PASSED', 'FAILED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(191) NULL,
    `tanggal_inspeksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Inspection_device_type_result_idx`(`device_type`, `result`),
    INDEX `Inspection_tanggal_inspeksi_idx`(`tanggal_inspeksi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AparInspectionDetail` (
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

    UNIQUE INDEX `AparInspectionDetail_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HydrantInspectionDetail` (
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

    UNIQUE INDEX `HydrantInspectionDetail_inspection_id_key`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspectionPhoto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inspection_id` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InspectionPhoto_inspection_id_idx`(`inspection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
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
CREATE TABLE `Audit` (
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

-- AddForeignKey
ALTER TABLE `Apar` ADD CONSTRAINT `Apar_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hydrant` ADD CONSTRAINT `Hydrant_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspection` ADD CONSTRAINT `Inspection_apar_id_fkey` FOREIGN KEY (`apar_id`) REFERENCES `Apar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspection` ADD CONSTRAINT `Inspection_hydrant_id_fkey` FOREIGN KEY (`hydrant_id`) REFERENCES `Hydrant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspection` ADD CONSTRAINT `Inspection_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AparInspectionDetail` ADD CONSTRAINT `AparInspectionDetail_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `Inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AparInspectionDetail` ADD CONSTRAINT `AparInspectionDetail_apar_id_fkey` FOREIGN KEY (`apar_id`) REFERENCES `Apar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AparInspectionDetail` ADD CONSTRAINT `AparInspectionDetail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HydrantInspectionDetail` ADD CONSTRAINT `HydrantInspectionDetail_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `Inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HydrantInspectionDetail` ADD CONSTRAINT `HydrantInspectionDetail_hydrant_id_fkey` FOREIGN KEY (`hydrant_id`) REFERENCES `Hydrant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HydrantInspectionDetail` ADD CONSTRAINT `HydrantInspectionDetail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectionPhoto` ADD CONSTRAINT `InspectionPhoto_inspection_id_fkey` FOREIGN KEY (`inspection_id`) REFERENCES `Inspection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Audit` ADD CONSTRAINT `Audit_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
