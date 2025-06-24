/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_customer_key";

-- DropIndex
DROP INDEX "Product_name_key";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "customer",
DROP COLUMN "id",
DROP COLUMN "total",
ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "order_id" SERIAL NOT NULL,
ADD COLUMN     "total_price" INTEGER NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id");
