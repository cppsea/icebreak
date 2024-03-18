const { GuildMemberRole } = require("@prisma/client");
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

async function addGuildMember(guildId, userId) {
  return await prisma.guildMembers.create({
    data: {
      userId: userId,
      guildId: guildId,
      points: 0,
      role: GuildMemberRole.Member,
    },
  });
}

// Returns a record containing the userId, firstName, lastName, avatar, and role.
async function getGuildMember(guildId, userId) {
  return await prisma.guildMembers.findUniqueOrThrow({
    where: {
      guildId: guildId,
      userId: userId,
    },
    select: {
      members: {
        where: {
          userId: userId,
        },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      role: true,
    },
  });
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

async function updateGuildMemberRole(guildId, userId, role) {
  return await prisma.guildMembers.update({
    where: {
      guildId: guildId,
      userId: userId,
    },
    data: {
      role: role,
    },
  });
}

async function deleteGuildMember(guildId, userId) {
  return await prisma.guildMembers.delete({
    where: {
      guildId: guildId,
      userId: userId,
    },
  });
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

module.exports = {
  getGuild,
  searchGuildByName,
  searchGuildByHandler,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
  addGuildMember,
  getGuildMember,
  getGuildMembers,
  updateGuildMemberRole,
  deleteGuildMember,
  guildExists,
  getLeaderboard,
};
