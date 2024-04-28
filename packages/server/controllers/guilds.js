const { GuildMemberRole } = require("@prisma/client");
const prisma = require("../prisma/prisma");
const { flatten } = require("../utils/flattener");
const MINIMUM_SIMILARITY = 0.3;

async function getAllGuilds() {
  return await prisma.guild.findMany();
}

async function getGuild(guildId) {
  return prisma.guild.findUniqueOrThrow({
    where: {
      guildId: guildId,
    },
  });
}

async function createGuild(guildData) {
  return await prisma.guild.create({
    data: guildData,
  });
}

async function updateGuild(guildId, guildData) {
  return await prisma.guild.update({
    where: {
      guildId: guildId,
    },
    data: guildData,
  });
}

async function deleteGuild(guildId) {
  return await prisma.guild.delete({
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
  const guild = await prisma.guild.findFirst({
    where: {
      guildId: guildId,
    },
  });

  return !!guild;
}

async function addGuildMember(guildId, userId) {
  return await prisma.guildMember.create({
    data: {
      userId: userId,
      guildId: guildId,
      points: 0,
      role: GuildMemberRole.Member,
    },
  });
}

async function getGuildMember(guildId, userId) {
  const getMember = await prisma.guildMember.findUnique({
    where: {
      guildId_userId: {
        guildId: guildId,
        userId: userId,
      },
    },
    include: {
      members: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  return getMember ? flatten(getMember) : getMember;
}

async function getAllGuildMembers(guildId) {
  const getMembers = await prisma.guildMember.findMany({
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
  return await prisma.guildMember.update({
    where: {
      guildId_userId: {
        guildId: guildId,
        userId: userId,
      },
    },
    data: {
      role: role,
    },
  });
}

async function deleteGuildMember(guildId, userId) {
  return await prisma.guildMember.delete({
    where: {
      guildId_userId: {
        guildId: guildId,
        userId: userId,
      },
    },
  });
}

async function getLeaderboard(guildId) {
  const guildLeaderboard = await prisma.guildMember.findMany({
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
  const guildMember = await prisma.guildMember.findUnique({
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
  searchGuildByName,
  searchGuildByHandler,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
  guildExists,
  addGuildMember,
  getGuildMember,
  getAllGuildMembers,
  updateGuildMemberRole,
  deleteGuildMember,
  getLeaderboard,
  isGuildMember,
};
