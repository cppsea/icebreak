const prisma = require("../prisma/prisma");
const MINIMUM_SIMILARITY = 0.3;

async function getAllGuilds() {
  return await prisma.guilds.findMany();
}

async function getGuild(guildId) {
  return prisma.guilds.findUniqueOrThrow({
    where: {
      guildId: guildId,
    },
  });
}

async function getGuildByHandler(handler) {
  return prisma.$queryRaw`
    SELECT guild_id, name, handler, avatar FROM guilds 
    WHERE handler = ${handler}`;
}

async function createGuild(guildData) {
  return await prisma.guilds.create({
    data: guildData,
  });
}

async function updateGuild(guildId, guildData) {
  return await prisma.guilds.update({
    where: {
      guildId: guildId,
    },
    data: guildData,
  });
}

async function deleteGuild(guildId) {
  return await prisma.guilds.delete({
    where: {
      guildId: guildId,
    },
  });
}

async function searchGuildByName(pattern) {
  return prisma.$queryRaw`
    SELECT guild_id, name, handler, avatar FROM guilds 
    WHERE WORD_SIMILARITY(${pattern}, name) > ${MINIMUM_SIMILARITY}
    ORDER BY WORD_SIMILARITY(${pattern}, name) DESC;`;
}

async function searchGuildByHandler(pattern) {
  return prisma.$queryRaw`
    SELECT guild_id, name, handler, avatar FROM guilds 
    WHERE SIMILARITY(${pattern}, handler) > ${MINIMUM_SIMILARITY}
    ORDER BY SIMILARITY(${pattern}, handler) DESC;`;
}

async function guildExists(guildId) {
  const guild = await prisma.guilds.findFirst({
    where: {
      guildId: guildId,
    },
  });

  return !!guild;
}

async function getGuildMembers(guildId) {
  const getMembers = await prisma.guildMembers.findMany({
    where: {
      guildId: guildId,
    },
    select: {
      members: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  const members = getMembers.flatMap((member) => member.members);

  return members;
}

async function getLeaderboard(guildId) {
  const guildLeaderboard = await prisma.guildMembers.findMany({
    where: {
      guildId: guildId,
    },

    include: {
      members: {
        select: {
          firstName: true,
          lastName: true,
          handler: true,
          avatar: true,
        },
      },
    },

    orderBy: [
      {
        points: "desc",
      },
    ],
  });

  const members = guildLeaderboard.map((member) => ({
    ...member.members,
    points: member.points,
  }));

  return members;
}

async function isGuildMember(guildId, userId) {
  const guildMember = await prisma.guildMembers.findUnique({
    where: {
      guildId_userId: {
        guildId: guildId,
        userId: userId,
      },
    },
  });
  return !!guildMember;
}

module.exports = {
  getGuild,
  getGuildByHandler,
  searchGuildByName,
  searchGuildByHandler,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
  getGuildMembers,
  guildExists,
  getLeaderboard,
  isGuildMember,
};
