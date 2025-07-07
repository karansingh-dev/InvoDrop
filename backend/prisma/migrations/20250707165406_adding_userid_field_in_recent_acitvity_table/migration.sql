/*
  Warnings:

  - You are about to drop the `RecentActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RecentActivity";

-- CreateTable
CREATE TABLE "recent_activity" (
    "id" UUID NOT NULL,
    "entity_type" "ActivityEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,

    CONSTRAINT "recent_activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recent_activity" ADD CONSTRAINT "recent_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
