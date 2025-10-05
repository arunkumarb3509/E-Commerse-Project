/*
  Warnings:

  - You are about to drop the column `tags` on the `sub_category` table. All the data in the column will be lost.
  - The `images` column on the `sub_category` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "sub_category" DROP COLUMN "tags",
DROP COLUMN "images",
ADD COLUMN     "images" BYTEA;
