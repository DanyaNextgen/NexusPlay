/*
  Warnings:

  - You are about to drop the `product_translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_translations" DROP CONSTRAINT "product_translations_productId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "product_translations";
