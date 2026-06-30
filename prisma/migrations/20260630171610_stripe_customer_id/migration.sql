/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_customer_id` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "stripe_customer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripe_customer_id_key" ON "subscription"("stripe_customer_id");
