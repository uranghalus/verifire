-- CreateTable
CREATE TABLE `apar` (
    `id` VARCHAR(191) NOT NULL,
    `kode_apar` VARCHAR(25) NOT NULL,
    `lantai` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `size` DOUBLE NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `apar_kode_apar_key`(`kode_apar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hydrant` (
    `id` VARCHAR(191) NOT NULL,
    `kode_unik` VARCHAR(191) NOT NULL,
    `kode_hydrant` VARCHAR(25) NOT NULL,
    `ukuran` VARCHAR(191) NOT NULL,
    `lantai` VARCHAR(191) NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hydrant_kode_unik_key`(`kode_unik`),
    UNIQUE INDEX `hydrant_kode_hydrant_key`(`kode_hydrant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apar_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `aparId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `nama_petugas` VARCHAR(150) NULL,
    `regu` VARCHAR(191) NOT NULL DEFAULT 'PAGI',
    `tanggal_kadaluarsa` DATETIME(3) NULL,
    `tanggal_refill` DATETIME(3) NULL,
    `kondisi` VARCHAR(150) NULL,
    `catatan` VARCHAR(191) NULL,
    `foto_apar` VARCHAR(191) NULL,
    `tanggal_inspeksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hydrant_inspections` (
    `id` VARCHAR(191) NOT NULL,
    `hydrantId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `regu` VARCHAR(191) NOT NULL DEFAULT 'PAGI',
    `nama_petugas` VARCHAR(150) NULL,
    `valve_machino_coupling` VARCHAR(150) NULL,
    `fire_hose_machino_coupling` VARCHAR(150) NULL,
    `selang_hydrant` VARCHAR(150) NULL,
    `noozle_hydrant` VARCHAR(150) NULL,
    `kaca_box_hydrant` VARCHAR(150) NULL,
    `kunci_box_hydrant` VARCHAR(150) NULL,
    `box_hydrant` VARCHAR(150) NULL,
    `alarm` VARCHAR(150) NULL,
    `foto_hydrant` VARCHAR(191) NULL,
    `tanggal_inspeksi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `apar` ADD CONSTRAINT `apar_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant` ADD CONSTRAINT `hydrant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar_inspections` ADD CONSTRAINT `apar_inspections_aparId_fkey` FOREIGN KEY (`aparId`) REFERENCES `apar`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `apar_inspections` ADD CONSTRAINT `apar_inspections_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant_inspections` ADD CONSTRAINT `hydrant_inspections_hydrantId_fkey` FOREIGN KEY (`hydrantId`) REFERENCES `hydrant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hydrant_inspections` ADD CONSTRAINT `hydrant_inspections_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
