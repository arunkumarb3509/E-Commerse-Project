/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the `_CategoryTypeToSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductCategoryType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stock_quantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `availability` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `created_by` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `modified_by` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('InStock', 'OutOfStock', 'PreOrder');

-- DropForeignKey
ALTER TABLE "_CategoryTypeToSubCategory" DROP CONSTRAINT "_CategoryTypeToSubCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryTypeToSubCategory" DROP CONSTRAINT "_CategoryTypeToSubCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategoryType" DROP CONSTRAINT "_ProductCategoryType_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductCategoryType" DROP CONSTRAINT "_ProductCategoryType_B_fkey";

-- DropIndex
DROP INDEX "category_types_type_name_key";

-- DropIndex
DROP INDEX "subcategories_category_type_id_key";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stock_quantity" INTEGER NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "availability",
ADD COLUMN     "availability" "Availability" NOT NULL,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL,
DROP COLUMN "modified_by",
ADD COLUMN     "modified_by" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CategoryTypeToSubCategory";

-- DropTable
DROP TABLE "_ProductCategoryType";

-- CreateTable
CREATE TABLE "product_size" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size_id" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL,

    CONSTRAINT "product_size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_image" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image_id" SERIAL NOT NULL,
    "images" BYTEA,
    "image_name" TEXT NOT NULL,
    "image_title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,

    CONSTRAINT "product_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_type_id_fkey" FOREIGN KEY ("category_type_id") REFERENCES "category_types"("category_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "product_size_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
