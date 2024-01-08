const prisma = require("../prisma/prisma");
const MINIMUM_SIMILARITY = 0.3;

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
  try {
    return await prisma.guilds.create({
      data: {
        name: guildData.name, // required field
        handler: guildData.handler,
        description: guildData.description,
        category: guildData.category,
        location: guildData.location || null, // optional field
        website: guildData.websiteUrl || null,
        tags: guildData.tags,
        media: guildData.media,
        isInviteOnly: guildData.isInviteOnly,
      },
    });
  } catch (error) {
    throw new Error(`Error creating guild: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
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

async function guildExists(guildId) {
  const guild = await prisma.guilds.findFirst({
    where: {
      guildId: guildId,
    },
  });

  return !!guild;
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
          avatar: true,
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
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
  getGuildMembers,
  guildExists,
};
