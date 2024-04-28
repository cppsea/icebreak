const prisma = require("./prisma");
const AuthController = require("../controllers/auth");
const GuildController = require("../controllers/guilds");
const EventController = require("../controllers/events");
const { GuildMemberRole, EventAttendeeStatus } = require("@prisma/client");

/**
 * Seed script for our PostgreSQL database through Prisma ORM.
 * Whenever we make new, breaking changes to our database schema,
 * data is lost and Prisma runs this seed script to re-populate the
 * database for convenience for development and testing.
 *
 * Read more here:
 *   https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
 */
async function main() {
  const testUser = await AuthController.register({
    email: "test@gmail.com",
    password: "test",
  });

  const sea = {
    guildId: "5f270196-ee82-4477-8277-8d4df5fcc864",
    name: "Software Engineering Association",
    handler: "cppsea",
    description:
      "CPP CS club dedicated to teaching students software engineering concepts and principles.",
    category: "Education",
    isInviteOnly: true,
  };

  const swift = {
    guildId: "759c1d08-8210-48b0-ae51-9dd2e555f748",
    name: "Cal Poly Swift",
    handler: "cppswift",
    description: "CPP club that teaches cybersecurity to students.",
    category: "Education",
    isInviteOnly: true,
  };

  const css = {
    guildId: "5325b147-5524-4539-b652-0549e074a159",
    name: "CPP Computer Science Society",
    handler: "cppcss",
    description: "CPP club for all things computer science.",
    category: "Education",
    isInviteOnly: true,
  };

  const seaGuild = await GuildController.createGuild(sea);
  const swiftGuild = await GuildController.createGuild(swift);
  const cssGuild = await GuildController.createGuild(css);

  await GuildController.addGuildMember(seaGuild.guildId, testUser.userId);
  await GuildController.updateGuildMemberRole(
    seaGuild.guildId,
    testUser.userId,
    GuildMemberRole.Owner,
  );

  await GuildController.addGuildMember(cssGuild.guildId, testUser.userId);
  await GuildController.addGuildMember(swiftGuild.guildId, testUser.userId);

  const cybersecurityEvent = await EventController.createEvent(
    {
      title: "Intro to Cybersecurity",
    },
    swiftGuild.guildId,
  );

  const workshopEvent = await EventController.createEvent(
    {
      title: "Workshop: The Software Development Lifecycle",
    },
    seaGuild.guildId,
  );

  await EventController.updateAttendeeStatus(
    cybersecurityEvent.eventId,
    testUser.userId,
    EventAttendeeStatus.Attending,
  );

  await EventController.updateAttendeeStatus(
    workshopEvent.eventId,
    testUser.userId,
    EventAttendeeStatus.Interested,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
