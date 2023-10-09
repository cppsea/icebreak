const prisma = require("../prisma/prisma");

async function getAllGuilds() {
  const query = await prisma.guilds.findMany();
  return query;
}

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
        location: guildData.location || null, // optional field
        website: guildData.websiteUrl || null,
        tags: guildData.tags,
        banner: guildData.bannerUrl,
        icon: guildData.iconUrl,
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

async function getGuild(guildId) {
  const query = await prisma.guilds.findFirst({
    where: {
      guildId: guildId,
    },
  });
  return query;
}

module.exports = {
  getGuild,
  getAllGuilds,
  insertGuild
};
