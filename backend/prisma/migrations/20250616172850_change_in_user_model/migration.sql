/*
  Warnings:

  - Made the column `verify_code_expires_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "verify_code_expires_at" SET NOT NULL;
