const prisma = require("../prisma/prisma");

async function getAllUsers() {
  const query = await prisma.user.findMany();
  return query;
}

async function getUser(userId) {
  const query = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });
  return query;
}

async function getUserEmail(userId) {
  const query = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });
  return query.email;
}

async function getUserByEmail(email) {
  const query = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return query;
}

async function getUserIdByEmail(email) {
  const query = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return query.userId;
}

async function getGuildsForUser(userId) {
  const userGuilds = await prisma.guildMember.findMany({
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

async function updateNewUser(userId, userData) {
  const updatedUser = await prisma.user.update({
    where: {
      userId: userId,
    },
    data: {
      ...userData,
      isNew: false,
    },
  });
  return updatedUser;
}

module.exports = {
  getUser,
  getAllUsers,
  getUserByEmail,
  getGuildsForUser,
  getUserIdByEmail,
  getUserEmail,
  updateNewUser,
};
