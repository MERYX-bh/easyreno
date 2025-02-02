-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_companyId_fkey`;

-- DropIndex
DROP INDEX `Project_companyId_fkey` ON `project`;

-- AlterTable
ALTER TABLE `project` MODIFY `companyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
