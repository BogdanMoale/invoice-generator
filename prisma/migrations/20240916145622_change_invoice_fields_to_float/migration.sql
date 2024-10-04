/*
  Warnings:

  - The `discountAmount` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subtotal` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `taxAmount` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `total` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "currencySymbol" TEXT NOT NULL DEFAULT '$',
DROP COLUMN "discountAmount",
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "subtotal",
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "taxAmount",
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "total",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;
