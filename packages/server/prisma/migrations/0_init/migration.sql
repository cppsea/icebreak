-- CreateEnum
CREATE TYPE "event_attendee_status" AS ENUM ('not interested', 'interested', 'attending', 'checked in');

-- CreateEnum
CREATE TYPE "guild_member_role" AS ENUM ('member', 'officer', 'owner');

-- CreateEnum
CREATE TYPE "user_pronoun" AS ENUM ('He/Him', 'She/Her', 'They/Them/Their');

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "joined_date" TIMESTAMP(6),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255),
    "password" VARCHAR(255),
    "is_new" BOOLEAN NOT NULL DEFAULT true,
    "handler" VARCHAR(50),
    "major" VARCHAR(100),

    CONSTRAINT "pk_user" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "event_attendees" (
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "status" "event_attendee_status" NOT NULL DEFAULT 'not interested',

    CONSTRAINT "pk_event_attendee" PRIMARY KEY ("user_id","event_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "guild_id" UUID NOT NULL,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "location" VARCHAR(255),
    "thumbnail" VARCHAR(255),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "pk_event" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "guild_members" (
    "user_id" UUID NOT NULL,
    "guild_id" UUID NOT NULL,
    "points" SMALLINT NOT NULL DEFAULT 0,
    "role" "guild_member_role" NOT NULL DEFAULT 'member',

    CONSTRAINT "pk_guild_member" PRIMARY KEY ("user_id","guild_id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "guild_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "handler" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "website" VARCHAR(255),
    "tags" TEXT[],
    "banner" VARCHAR(255),
    "avatar" VARCHAR(255),
    "media" TEXT[],
    "invite_only" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk_guild" PRIMARY KEY ("guild_id")
);

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "fk_event" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_guild" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "fk_guild" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

