const prisma = require("../utils/prisma");

async function getAllGuilds() {
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

async function insertGuild() {
  return prisma.guild.create({
    data: {
      guildId: "40827abc14",
      name: "test guild",
      description: "best guild",
    },
  });
}

module.exports = {
  getGuild,
  getAllGuilds,
  insertGuild,
};
