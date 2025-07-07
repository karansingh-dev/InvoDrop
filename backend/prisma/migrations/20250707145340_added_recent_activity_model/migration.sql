-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('created', 'paid', 'added');

-- CreateEnum
CREATE TYPE "ActivityEntityType" AS ENUM ('invoice', 'client');

-- CreateTable
CREATE TABLE "RecentActivity" (
    "id" UUID NOT NULL,
    "entity_type" "ActivityEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentActivity_pkey" PRIMARY KEY ("id")
);
