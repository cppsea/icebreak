/*
  Warnings:

  - The values [not interested,interested,attending,checked in] on the enum `event_attendee_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [member,officer,owner] on the enum `guild_member_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "event_attendee_status_new" AS ENUM ('Not Interested', 'Interested', 'Attending', 'Checked In');
ALTER TABLE "event_attendees" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "event_attendees" ALTER COLUMN "status" TYPE "event_attendee_status_new" USING ("status"::text::"event_attendee_status_new");
ALTER TYPE "event_attendee_status" RENAME TO "event_attendee_status_old";
ALTER TYPE "event_attendee_status_new" RENAME TO "event_attendee_status";
DROP TYPE "event_attendee_status_old";
ALTER TABLE "event_attendees" ALTER COLUMN "status" SET DEFAULT 'Not Interested';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "guild_member_role_new" AS ENUM ('Member', 'Officer', 'Owner');
ALTER TABLE "guild_members" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "guild_members" ALTER COLUMN "role" TYPE "guild_member_role_new" USING ("role"::text::"guild_member_role_new");
ALTER TYPE "guild_member_role" RENAME TO "guild_member_role_old";
ALTER TYPE "guild_member_role_new" RENAME TO "guild_member_role";
DROP TYPE "guild_member_role_old";
ALTER TABLE "guild_members" ALTER COLUMN "role" SET DEFAULT 'Member';
COMMIT;

-- AlterTable
ALTER TABLE "event_attendees" ALTER COLUMN "status" SET DEFAULT 'Not Interested';

-- AlterTable
ALTER TABLE "guild_members" ALTER COLUMN "role" SET DEFAULT 'Member';
