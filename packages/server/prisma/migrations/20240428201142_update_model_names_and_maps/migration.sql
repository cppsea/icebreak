/*
  Warnings:

  - The primary key for the `event_attendees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `guild_members` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "event_attendees" DROP CONSTRAINT "pk_event_attendee",
ADD CONSTRAINT "pk_event_attendee" PRIMARY KEY ("event_id", "user_id");

-- AlterTable
ALTER TABLE "guild_members" DROP CONSTRAINT "pk_guild_member",
ADD CONSTRAINT "pk_guild_member" PRIMARY KEY ("guild_id", "user_id");
