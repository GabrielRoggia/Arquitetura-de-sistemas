/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `type_payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "type_payments_name_key" ON "public"."type_payments"("name");
