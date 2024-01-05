const prisma = require("../prisma/prisma");
const MINIMUM_SIMILARITY = 0.3;

async function insertGuild(guildData) {
  try {
    const media = [
      guildData.twitterUrl,
      guildData.facebookUrl,
      guildData.instagramUrl,
      guildData.discordUrl,
      guildData.linkedinUrl,
      guildData.githubUrl,
    ];

    const query = await prisma.guilds.create({
      data: {
        guildId: guildData.guildId,
        name: guildData.title, // required field
        handler: guildData.handler,
        description: guildData.description,
        category: guildData.category,
        banner: guildData.bannerUrl || null,
        icon: guildData.iconUrl || null,
        location: guildData.location || null, // optional field
        website: guildData.websiteUrl || null,
        tags: guildData.tags,
        media: media || null,
        isInviteOnly: guildData.isInviteOnly,
      },
    });

    return query;
  } catch (error) {
    throw new Error(`Error inserting guild: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

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
  insertGuild,
  searchGuildByName,
  searchGuildByHandler,
  getAllGuilds,
  createGuild,
  updateGuild,
  deleteGuild,
  getGuildMembers,
  guildExists,
};
