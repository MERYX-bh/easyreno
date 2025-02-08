-- CreateTable
CREATE TABLE `Chantier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'en cours',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Chantier_adId_key`(`adId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Etape` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chantierId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `details` TEXT NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `ownerValidated` BOOLEAN NOT NULL DEFAULT false,
    `companyValidated` BOOLEAN NOT NULL DEFAULT false,
    `reserve` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chantier` ADD CONSTRAINT `Chantier_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chantier` ADD CONSTRAINT `Chantier_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Etape` ADD CONSTRAINT `Etape_chantierId_fkey` FOREIGN KEY (`chantierId`) REFERENCES `Chantier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
