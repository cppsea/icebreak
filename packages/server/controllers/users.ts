import prisma from "../utils/prisma";
import { User } from "@prisma/client";

async function getAllUsers(): Promise<User[]> {
  const query = await prisma.user.findMany();
  return query;
}

async function getUser(userId: string): Promise<User | null> {
  const query = await prisma.user.findUnique({
    where: {
      userId: userId
    }
  });
  return query;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const query = await prisma.user.findUnique({
    where: {
      email: email
    }
  });
  return query;
}

export default {
  getUser,
  getAllUsers,
  getUserByEmail
};
