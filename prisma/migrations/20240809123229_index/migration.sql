-- CreateTable
CREATE TABLE "BusinessProfile" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyOwnerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    "websiteUrl" TEXT,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "main_category" (
    "main_category_id" SERIAL NOT NULL,
    "main_category_name" TEXT NOT NULL,
    "main_category_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "main_category_pkey" PRIMARY KEY ("main_category_id")
);

-- CreateTable
CREATE TABLE "otp_verification" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_date" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "workflow" TEXT NOT NULL DEFAULT 'initial',
    "token" TEXT,

    CONSTRAINT "otp_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_date" TIMESTAMP(3),

    CONSTRAINT "login_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_registration" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" BIGINT,
    "customer_type" TEXT NOT NULL,

    CONSTRAINT "user_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "description" TEXT,
    "role_type" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_email_key" ON "BusinessProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "main_category_main_category_name_key" ON "main_category"("main_category_name");

-- CreateIndex
CREATE UNIQUE INDEX "otp_verification_email_key" ON "otp_verification"("email");

-- CreateIndex
CREATE UNIQUE INDEX "login_account_email_key" ON "login_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_registration_email_key" ON "user_registration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
