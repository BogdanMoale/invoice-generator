/*
  Warnings:

  - You are about to drop the column `taxAmount` on the `invoice_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "taxAmount",
ADD COLUMN     "totalTax" DOUBLE PRECISION NOT NULL DEFAULT 0;
