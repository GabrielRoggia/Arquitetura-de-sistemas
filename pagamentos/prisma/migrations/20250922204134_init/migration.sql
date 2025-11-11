-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO');

-- CreateTable
CREATE TABLE "public"."type_payments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "type_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
    "typePaymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."order_payments" ADD CONSTRAINT "order_payments_typePaymentId_fkey" FOREIGN KEY ("typePaymentId") REFERENCES "public"."type_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
