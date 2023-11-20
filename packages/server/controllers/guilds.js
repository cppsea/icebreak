const prisma = require("../prisma/prisma");

async function getAllGuilds() {
  return await prisma.guilds.findMany();
}

async function getGuild(guildId) {
  return await prisma.guilds.findUniqueOrThrow({
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

module.exports = {
  getGuild,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
};
