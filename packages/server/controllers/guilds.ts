import prisma from "../utils/prisma";
import { Guild } from ".prisma/client/index";

async function getAllGuilds() {
  const query = await prisma.guild.findMany();
  return query;
}

async function getGuild(guildId: string): Promise<Guild | null> {
  const query = await prisma.guild.findFirst({
    where: {
      guildId: guildId,
    },
  });
  return query;
}

module.exports = {
  getGuild,
  getAllGuilds,
};
