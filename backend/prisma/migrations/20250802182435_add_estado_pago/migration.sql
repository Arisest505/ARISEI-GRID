/*
  Warnings:

  - Added the required column `estado_pago` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "estado_pago" TEXT NOT NULL;
