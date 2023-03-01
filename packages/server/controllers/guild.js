const prisma = require("../utils/prisma");

async function getAllGuild() {
  const query = await prisma.guild.findMany();
  return query;
}

async function getGuild(guildId) {
  const query = await prisma.guild.findFirst({
    where: {
      guildId: guildId,
    },
  });
  return query;
}

module.exports = {
  getGuild,
  getAllGuild,
};
