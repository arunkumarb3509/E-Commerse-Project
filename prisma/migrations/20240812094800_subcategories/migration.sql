-- CreateTable
CREATE TABLE "sub_category" (
    "sub_category_id" SERIAL NOT NULL,
    "main_category_name" TEXT,
    "sub_category_name" TEXT NOT NULL,
    "sub_category_description" TEXT,
    "tags" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_category_pkey" PRIMARY KEY ("sub_category_id")
);

-- AddForeignKey
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_main_category_name_fkey" FOREIGN KEY ("main_category_name") REFERENCES "main_category"("main_category_name") ON DELETE SET NULL ON UPDATE CASCADE;
