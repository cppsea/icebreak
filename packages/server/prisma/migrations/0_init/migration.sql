-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "joined_date" TIMESTAMP(6),
    "last_login" TIMESTAMP(6),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255),
    "password" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "event_attendees" (
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,

    CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("user_id","event_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" UUID NOT NULL,
    "guild_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "location" VARCHAR(255),
    "thumbnail" VARCHAR(255),

    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "guild_members" (
    "user_id" UUID NOT NULL,
    "guild_id" UUID NOT NULL,

    CONSTRAINT "users_guilds_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "guild_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "handler" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "website" VARCHAR(255),
    "tags" TEXT[],
    "banner" VARCHAR(255),
    "icon" VARCHAR(255),
    "media" TEXT[],
    "invite_only" BOOLEAN NOT NULL,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("guild_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "fk_event" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "event_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "fk_guild" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guild_members" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

