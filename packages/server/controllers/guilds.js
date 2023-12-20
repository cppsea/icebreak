const prisma = require("../prisma/prisma");

async function getAllGuilds() {
  const query = await prisma.guilds.findMany();
  return query;
}

async function getGuild(guildId) {
  const query = await prisma.guilds.findFirst({
    where: {
      guildId: guildId,
    },
  });
  return query;
}

async function searchGuild(pattern) {
  return prisma.$queryRaw`SELECT * FROM guilds WHERE SIMILARITY(name, ${pattern}) > 0.3 ORDER BY SIMILARITY(name, ${pattern}) DESC;`;
}

module.exports = {
  getGuild,
  getAllGuilds,
  searchGuild,
};
