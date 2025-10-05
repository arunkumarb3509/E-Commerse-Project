/*
  Warnings:

  - You are about to drop the `main_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_main_category_id_fkey";

-- DropTable
DROP TABLE "main_category";

-- DropTable
DROP TABLE "sub_category";

-- CreateTable
CREATE TABLE "main_categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "category_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "main_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "subcategory_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "category_type_id" INTEGER NOT NULL,
    "subcategory_name" TEXT NOT NULL,
    "subcategory_description" TEXT,
    "images" BYTEA,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("subcategory_id")
);

-- CreateTable
CREATE TABLE "category_types" (
    "category_type_id" SERIAL NOT NULL,
    "type_name" TEXT NOT NULL,

    CONSTRAINT "category_types_pkey" PRIMARY KEY ("category_type_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "category_id" INTEGER,
    "subcategory_id" INTEGER,
    "category_type_id" INTEGER,
    "material_type" TEXT,
    "product_code" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "total_stock" INTEGER NOT NULL,
    "reorder_level" INTEGER NOT NULL,
    "availability" INTEGER NOT NULL,
    "product_description" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "modified_by" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "seo_information" (
    "seo_id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "keywords" TEXT,
    "care_instructions" TEXT,
    "return_policy" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_information_pkey" PRIMARY KEY ("seo_id")
);

-- CreateTable
CREATE TABLE "shipping_information" (
    "shipping_id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "weight" DECIMAL(65,30),
    "dimensions" TEXT,
    "shipping_class" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_information_pkey" PRIMARY KEY ("shipping_id")
);

-- CreateTable
CREATE TABLE "_CategoryTypeToSubCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductCategoryType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "main_categories_category_name_key" ON "main_categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_category_type_id_key" ON "subcategories"("category_type_id");

-- CreateIndex
CREATE INDEX "subcategories_category_id_idx" ON "subcategories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_types_type_name_key" ON "category_types"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "seo_information_product_id_key" ON "seo_information"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_information_product_id_key" ON "shipping_information"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryTypeToSubCategory_AB_unique" ON "_CategoryTypeToSubCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryTypeToSubCategory_B_index" ON "_CategoryTypeToSubCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductCategoryType_AB_unique" ON "_ProductCategoryType"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductCategoryType_B_index" ON "_ProductCategoryType"("B");

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "main_categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("subcategory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "main_categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_type_id_fkey" FOREIGN KEY ("category_type_id") REFERENCES "category_types"("category_type_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_information" ADD CONSTRAINT "seo_information_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_information" ADD CONSTRAINT "shipping_information_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTypeToSubCategory" ADD CONSTRAINT "_CategoryTypeToSubCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "category_types"("category_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTypeToSubCategory" ADD CONSTRAINT "_CategoryTypeToSubCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "subcategories"("subcategory_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategoryType" ADD CONSTRAINT "_ProductCategoryType_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategoryType" ADD CONSTRAINT "_ProductCategoryType_B_fkey" FOREIGN KEY ("B") REFERENCES "subcategories"("subcategory_id") ON DELETE CASCADE ON UPDATE CASCADE;
