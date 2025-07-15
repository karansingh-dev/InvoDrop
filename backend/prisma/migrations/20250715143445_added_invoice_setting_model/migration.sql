/*
  Warnings:

  - You are about to drop the column `notes` on the `invoices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tax_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `logo_url` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_note` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terms_and_conditions` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "logo_url" VARCHAR(255) NOT NULL,
ADD COLUMN     "tax_id" VARCHAR(255);

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "notes",
ADD COLUMN     "default_note" VARCHAR(255) NOT NULL,
ADD COLUMN     "terms_and_conditions" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "invoice_setting" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "invoice_number_format" VARCHAR(255) NOT NULL,
    "terms_and_conditions" VARCHAR(255) NOT NULL,
    "default_note" VARCHAR(255) NOT NULL,

    CONSTRAINT "invoice_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_setting_user_id_key" ON "invoice_setting"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_tax_id_key" ON "companies"("tax_id");

-- AddForeignKey
ALTER TABLE "invoice_setting" ADD CONSTRAINT "invoice_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
