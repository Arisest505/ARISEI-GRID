/*
  Warnings:

  - Made the column `rol_asociado` on table `Plan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "rol_asociado" SET NOT NULL;
