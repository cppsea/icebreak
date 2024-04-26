const prisma = require("./prisma");
const AuthController = require("../controllers/auth");
const GuildController = require("../controllers/guilds");

/**
 * Seed script for our PostgreSQL database through Prisma ORM.
 * Whenever we make new breaking changes to our database schema,
 * data is lost and Prisma runs this seed script to re-populate the
 * database.
 *
 * Read more here:
 *   https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
 */
async function main() {
  const testUser = {
    email: "test@gmail.com",
    password: "test",
  };

  await AuthController.register(testUser);

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

  await GuildController.createGuild(sea);
  await GuildController.createGuild(swift);
  await GuildController.createGuild(css);
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
