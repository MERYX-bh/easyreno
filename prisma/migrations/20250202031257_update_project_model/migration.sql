/*
  Warnings:

  - You are about to drop the column `filePath` on the `quote` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `quote` table. All the data in the column will be lost.
  - Added the required column `adId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Quote_companyId_fkey`;

-- DropIndex
DROP INDEX `Quote_companyId_fkey` ON `quote`;

-- AlterTable
ALTER TABLE `quote` DROP COLUMN `filePath`,
    DROP COLUMN `title`,
    ADD COLUMN `adId` INTEGER NOT NULL,
    ADD COLUMN `businessId` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `companyId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Business` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Business_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Business`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_adId_fkey` FOREIGN KEY (`adId`) REFERENCES `Ad`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
