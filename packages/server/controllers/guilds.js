const prisma = require("../prisma/prisma");

async function getAllGuilds() {
  return await prisma.guilds.findMany();
}

async function getGuild(guildId) {
  return await prisma.guilds.findUnique({
    where: {
      guildId: guildId,
    },
  });
}

// TODO: Remove guildId param
async function createGuild(eventData) {
  try {
    return await prisma.guilds.create({
      // Guild Data
      data: eventData,
    });
  } catch (error) {
    return null;
  }
}

async function updateGuild(guildId, eventData) {
  try {
    return await prisma.guilds.update({
      where: {
        guildId: guildId,
      },
      // Guild Data
      data: eventData,
    });
  } catch (error) {
    return null;
  }
}

async function deleteGuild(guildId) {
  try {
    return await prisma.guilds.delete({
      where: {
        guildId: guildId,
      },
    });
  } catch (error) {
    return null;
  }
}

module.exports = {
  getGuild,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
};
