const prisma = require("../prisma/prisma");

async function getAllUsers() {
  const query = await prisma.users.findMany();
  return query;
}

async function getUser(userId) {
  return prisma.users.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });
}

async function getUserByEmail(email) {
  const query = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return query;
}

async function getUserIdByEmail(email) {
  const query = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return query.userId;
}

async function getGuildsForUser(userId) {
  const userGuilds = await prisma.guildMembers.findMany({
    where: {
      userId: userId,
    },
    include: {
      guilds: {
        select: {
          avatar: true,
          guildId: true,
          name: true,
          handler: true,
        },
      },
    },
  });

  const guilds = userGuilds.map((userGuild) => userGuild.guilds);
  return guilds;
}

module.exports = {
  getUser,
  getAllUsers,
  getUserByEmail,
  getGuildsForUser,
  getUserIdByEmail,
};
