-- CreateTable
CREATE TABLE "event" (
    "event_id" VARCHAR(255) NOT NULL,
    "guild_id" VARCHAR(255),
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "location" VARCHAR(255),
    "thumbnail" VARCHAR(255),

    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "guild" (
    "guild_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "handler" VARCHAR(50),
    "description" TEXT,
    "media" TEXT[],
    "invite_only" BOOLEAN,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("guild_id")
);

-- CreateTable
CREATE TABLE "members_pending" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "event_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "members_pending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_guild" (
    "user_id" VARCHAR(255) NOT NULL DEFAULT 'undefined',
    "guild_id" VARCHAR(255) NOT NULL DEFAULT 'undefined',
    "user_role" VARCHAR(255),
    "points" SMALLINT,
    "rank" SMALLINT,

    CONSTRAINT "user_guild_pkey" PRIMARY KEY ("user_id","guild_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(255) NOT NULL,
    "joined_date" TIMESTAMP(6),
    "last_login" TIMESTAMP(6),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members_pending" ADD CONSTRAINT "members_pending_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members_pending" ADD CONSTRAINT "members_pending_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_guild" ADD CONSTRAINT "user_guild_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_guild" ADD CONSTRAINT "user_guild_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
