const prisma = require("../prisma/prisma");

const MINIMUM_SIMILARITY = 0.3;

async function getGuild(guildId) {
  const query = await prisma.guilds.findFirst({
    where: {
      guildId: guildId,
    },
  });
  return query;
}

async function searchGuildByName(pattern) {
  return prisma.$queryRaw`
    SELECT guild_id, name, handler, icon FROM guilds 
    WHERE SIMILARITY(name, ${pattern}) > ${MINIMUM_SIMILARITY}
    ORDER BY SIMILARITY(name, ${pattern}) DESC;`;
}

async function searchGuildByHandler(pattern) {
  return prisma.$queryRaw`
    SELECT guild_id, name, handler, icon FROM guilds 
    WHERE SIMILARITY(handler, ${pattern}) > ${MINIMUM_SIMILARITY}
    ORDER BY SIMILARITY(handler, ${pattern}) DESC;`;
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
        },
      },
    },
  });

  const members = getMembers.flatMap((member) => member.members);

  return members;
}

module.exports = {
  getGuild,
  searchGuildByName,
  searchGuildByHandler,
  getGuildMembers,
};
