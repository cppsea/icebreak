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
  const data = cleanEventData(eventData);
  try {
    return await prisma.guilds.create({
      // Guild Data
      data: data,
    });
  } catch (error) {
    return null;
  }
}

async function updateGuild(guildId, eventData) {
  const data = cleanEventData(eventData);
  try {
    return await prisma.guilds.update({
      where: {
        guildId: guildId,
      },
      // Guild Data
      data: data,
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

// This function returns an object that only has fields
// specified by the Prisma schema.
function cleanEventData(eventData) {
  return {
    guildId: eventData.guildId,
    name: eventData.name,
    handler: eventData.handler,
    description: eventData.description,
    category: eventData.category,
    location: eventData.location,
    website: eventData.website,
    tags: eventData.tags,
    banner: eventData.banner,
    icon: eventData.icon,
    media: eventData.media,
    isInviteOnly: eventData.isInviteOnly,
    events: eventData.events,
    members: eventData.members,
  }
}

module.exports = {
  getGuild,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
};
