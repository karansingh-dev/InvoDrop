/*
  Warnings:

  - Added the required column `notes` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "notes" VARCHAR(255) NOT NULL;
