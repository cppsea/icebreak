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

// TODO: Remove guildId param
async function createGuild(eventData) {
  try {
    const created_guild = await prisma.guilds.create({
      // Guild Data
      data: eventData,
    });
    return created_guild;
  } catch (error) {
    return null;
  }
}

async function updateGuild(guildId, eventData) {
  try {
    const updated_guild = await prisma.guilds.update({
      where: {
        guildId: guildId,
      },
      // Guild Data
      data: eventData,
    });
    return updated_guild;
  } catch (error) {
    return null;
  }
}

async function deleteGuild(guildId) {
  try {
    const deleted_guild = await prisma.guilds.delete({
      where: {
        guildId: guildId,
      },
    });
    return deleted_guild;
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
