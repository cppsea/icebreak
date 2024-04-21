const prisma = require("../prisma/prisma");

async function getAllUsers() {
  const query = await prisma.users.findMany();
  return query;
}

async function getUser(userId) {
  const query = await prisma.users.findUnique({
    where: {
      userId: userId,
    },
  });
  return query;
}

async function getUserEmail(userId) {
  const query = await prisma.users.findUnique({
    where: {
      userId: userId,
    },
  });
  return query.email;
}

async function getUserByEmail(email) {
  const query = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return query;
}

async function getUserIdByEmail(email) {
  const query = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return query.userId;
}

async function getGuildsForUser(userId) {
  const userGuilds = await prisma.guildMembers.findMany({
    where: {
      userId: userId,
    },
    include: {
      guilds: {
        select: {
          avatar: true,
          guildId: true,
          name: true,
          handler: true,
        },
      },
    },
  });

  const guilds = userGuilds.map((userGuild) => userGuild.guilds);
  return guilds;
}

async function updateNewUser(userId, userData) {
  const updateEvent = await prisma.events.update({
    where: {
      userId: userId,
    },
    //If a given data was not updated, it will be undefined and prisma will ignore the update of that field
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      age: userData.age,
      pronouns: userData.pronouns,
      major: userData.major,
      interests: userData.interests,
    },
  });
  return updateEvent;
}

module.exports = {
  getUser,
  getAllUsers,
  getUserByEmail,
  getGuildsForUser,
  getUserIdByEmail,
  getUserEmail,
  updateNewUser,
};
