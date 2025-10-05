/*
  Warnings:

  - You are about to drop the column `main_category_name` on the `sub_category` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `main_category_id` to the `sub_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_main_category_name_fkey";

-- AlterTable
ALTER TABLE "sub_category" DROP COLUMN "main_category_name",
ADD COLUMN     "images" TEXT,
ADD COLUMN     "main_category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "description" TEXT,
    "role_type" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_role_name_key" ON "role"("role_name");

-- CreateIndex
CREATE INDEX "sub_category_main_category_id_idx" ON "sub_category"("main_category_id");

-- AddForeignKey
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_main_category_id_fkey" FOREIGN KEY ("main_category_id") REFERENCES "main_category"("main_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;
