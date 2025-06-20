-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "invoice_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_billed_amount" DECIMAL(10,2) NOT NULL DEFAULT 0;
