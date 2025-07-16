/*
  Warnings:

  - A unique constraint covering the columns `[email,user_id]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clients_email_user_id_key" ON "clients"("email", "user_id");
