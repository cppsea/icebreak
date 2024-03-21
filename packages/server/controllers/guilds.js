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
// Fix this so that
async function getGuildMember(guildId, userId) {
  const getMember = await prisma.guildMembers.findUniqueOrThrow({
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

  // temp for functionality, replace later
  const flattenedData = Object.entries(getMember)
    .flatMap(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return Object.entries(value).map(([subKey, subValue]) => [
          subKey,
          subValue,
        ]);
      } else {
        return [[key, value]];
      }
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return flattenedData;
}

async function getAllGuildMembers(guildId) {
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
  return await prisma.guildMembers.delete({
    where: {
      guildId_userId: {
        guildId: guildId,
        userId: userId,
      },
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
