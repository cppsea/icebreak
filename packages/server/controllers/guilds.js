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
        },
      },
    },
  });

  const members = getMembers.flatMap((member) => member.members);

  return members;
}

module.exports = {
  getGuild,
  getAllGuilds,
  getGuildMembers,
};
