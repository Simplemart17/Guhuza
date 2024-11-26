/*
  Warnings:

  - You are about to drop the column `last_question_answered` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `last_question_answered`,
    ADD COLUMN `question_answered` VARCHAR(191) NOT NULL DEFAULT '0';
