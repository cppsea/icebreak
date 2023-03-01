import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ["info"],
  });
}
prisma = global.prisma;

export default prisma;
// Prevents hitting the limit on number of Prisma Clients instantiated while testing the code locally
// Achieves goal by setting a single global instance of Prisma Client to be used when local testing