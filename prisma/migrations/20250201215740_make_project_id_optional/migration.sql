-- AlterTable
ALTER TABLE `quote` ADD COLUMN `projectId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
