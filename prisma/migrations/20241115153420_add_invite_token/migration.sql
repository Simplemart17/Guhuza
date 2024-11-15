/*
  Warnings:

  - You are about to drop the column `status` on the `Invite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inviteToken]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteToken` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Invite` DROP COLUMN `status`,
    ADD COLUMN `inviteToken` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invite_inviteToken_key` ON `Invite`(`inviteToken`);
