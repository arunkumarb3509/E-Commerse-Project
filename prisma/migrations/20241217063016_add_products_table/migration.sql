/*
  Warnings:

  - Changed the type of `availability` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "availability",
ADD COLUMN     "availability" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Availability";
