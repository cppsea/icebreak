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

async function getUserByEmail(email) {
  const query = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return query;
}

module.exports = {
  getUser,
  getAllUsers,
  getUserByEmail,
};
