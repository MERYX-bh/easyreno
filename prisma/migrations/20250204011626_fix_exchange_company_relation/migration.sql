/*
  Warnings:

  - You are about to drop the column `businessId` on the `exchange` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Exchange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exchange` DROP FOREIGN KEY `Exchange_businessId_fkey`;

-- DropIndex
DROP INDEX `Exchange_businessId_fkey` ON `exchange`;

-- AlterTable
ALTER TABLE `exchange` DROP COLUMN `businessId`,
    ADD COLUMN `companyId` INTEGER NOT NULL,
    ADD COLUMN `quoteId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Exchange` ADD CONSTRAINT `Exchange_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exchange` ADD CONSTRAINT `Exchange_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
