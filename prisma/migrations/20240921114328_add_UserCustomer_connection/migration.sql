/*
  Warnings:

  - You are about to drop the column `userId` on the `customers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_userId_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "user_customers" (
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "user_customers_pkey" PRIMARY KEY ("userId","customerId")
);

-- AddForeignKey
ALTER TABLE "user_customers" ADD CONSTRAINT "user_customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_customers" ADD CONSTRAINT "user_customers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
