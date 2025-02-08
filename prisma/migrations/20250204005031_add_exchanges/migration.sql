/*
  Warnings:

  - You are about to drop the column `companyId` on the `exchange` table. All the data in the column will be lost.
  - You are about to drop the column `object` on the `exchange` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `exchange` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `exchange` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `message` table. All the data in the column will be lost.
  - Added the required column `businessId` to the `Exchange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exchange` DROP FOREIGN KEY `Exchange_companyId_fkey`;

-- DropIndex
DROP INDEX `Exchange_companyId_fkey` ON `exchange`;

-- AlterTable
ALTER TABLE `exchange` DROP COLUMN `companyId`,
    DROP COLUMN `object`,
    DROP COLUMN `title`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `businessId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `createdAt`,
    ADD COLUMN `fileUrl` VARCHAR(191) NULL,
    ADD COLUMN `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `content` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Exchange` ADD CONSTRAINT `Exchange_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
