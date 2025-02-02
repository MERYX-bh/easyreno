-- AlterTable
ALTER TABLE `quote` ADD COLUMN `ownerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Owner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
