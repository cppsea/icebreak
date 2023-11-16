const prisma = require("../prisma/prisma");
const { v4: uuidv4 } = require("uuid");

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
async function createGuild(eventdata) {
  const guildId = uuidv4();
  try {
    const created_guild = await prisma.guilds.create({
      // Guild Data
      data: {
        guildId: guildId,
        name: eventdata.name,
        handler: eventdata.handler,
        description: eventdata.description,
        category: eventdata.category,
        location: eventdata.location,
        website: eventdata.website,
        tags: eventdata.tags,
        banner: eventdata.banner,
        icon: eventdata.icon,
        media: eventdata.media,
        isInviteOnly: eventdata.isInviteOnly,
      },
    });
    return created_guild;
  } catch (error) {
    return null;
  }
}

async function updateGuild(guildId, eventdata) {
  try {
    const updated_guild = await prisma.guilds.update({
      where: {
        guildId: guildId,
      },
      // Guild Data
      data: {
        name: eventdata.name,
        handler: eventdata.handler,
        description: eventdata.description,
        category: eventdata.category,
        location: eventdata.location,
        website: eventdata.website,
        tags: eventdata.tags,
        banner: eventdata.banner,
        icon: eventdata.icon,
        media: eventdata.media,
        isInviteOnly: eventdata.isInviteOnly,
      },
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
