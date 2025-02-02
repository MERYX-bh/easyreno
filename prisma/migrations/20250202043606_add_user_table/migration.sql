/*
  Warnings:

  - You are about to drop the column `businessId` on the `quote` table. All the data in the column will be lost.
  - You are about to drop the `business` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `quote` DROP FOREIGN KEY `Business_Quote_fkey`;

-- DropIndex
DROP INDEX `Business_Quote_fkey` ON `quote`;

-- AlterTable
ALTER TABLE `quote` DROP COLUMN `businessId`;

-- DropTable
DROP TABLE `business`;
