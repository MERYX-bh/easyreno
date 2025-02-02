-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Quote_adId_fkey`;

-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Quote_businessId_fkey`;

-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Quote_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Quote_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Quote_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Business_Quote_fkey` FOREIGN KEY (`businessId`) REFERENCES `Business`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Ad_Quote_fkey` FOREIGN KEY (`adId`) REFERENCES `Ad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Company_Quote_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Owner_Quote_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Owner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Project_Quote_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
