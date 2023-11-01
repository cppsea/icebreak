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

async function getGuildUsers(guildId) {
  const query = await prisma.guildMembers.findMany({
    where: {
      guildId: guildId,
    },
  });
  return query;
}

module.exports = {
  getGuild,
  getAllGuilds,
  getGuildUsers,
};
