const prisma = require("../prisma/prisma");
const crypto = require("node:crypto");

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
  const hash = crypto.createHash("sha256");
  hash.update(email);
  const emailHash = hash.digest("hex");
  const query = await prisma.user.findUnique({
    where: {
      email: emailHash,
    },
  });
  return query;
}

async function getUserIdByEmail(email) {
  const hash = crypto.createHash("sha256");
  hash.update(email);
  const emailHash = hash.digest("hex");
  const query = await prisma.user.findUnique({
    where: {
      email: emailHash,
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

module.exports = {
  getUser,
  getAllUsers,
  getUserByEmail,
  getGuildsForUser,
  getUserIdByEmail,
  getUserEmail,
};
