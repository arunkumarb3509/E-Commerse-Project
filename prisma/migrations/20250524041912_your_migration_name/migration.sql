/*
  Warnings:

  - A unique constraint covering the columns `[product_code]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "product_offers" (
    "offer_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "offer_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount_percentage" INTEGER,
    "discount_price" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "expired_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "modified_by" TEXT NOT NULL,

    CONSTRAINT "product_offers_pkey" PRIMARY KEY ("offer_id")
);

-- CreateTable
CREATE TABLE "add_to_cart" (
    "cart_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER,
    "guest_user_id" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date" TIMESTAMP(3) NOT NULL,
    "created_at" TEXT NOT NULL,
    "modified_at" TEXT NOT NULL,

    CONSTRAINT "add_to_cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "customer_saved_order" (
    "saved_order_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "guest_user_id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_saved_order_pkey" PRIMARY KEY ("saved_order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- AddForeignKey
ALTER TABLE "product_offers" ADD CONSTRAINT "product_offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "add_to_cart" ADD CONSTRAINT "add_to_cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "add_to_cart" ADD CONSTRAINT "add_to_cart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user_registration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_saved_order" ADD CONSTRAINT "customer_saved_order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
