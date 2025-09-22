/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Payment";

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
