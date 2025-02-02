/*
  Warnings:

  - You are about to drop the column `foreman` on the `project` table. All the data in the column will be lost.
  - Made the column `description` on table `project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `foreman`,
    MODIFY `description` VARCHAR(191) NOT NULL;
