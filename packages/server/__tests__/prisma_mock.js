const { mockDeep, mockReset } = require("jest-mock-extended");
const prisma = require("../prisma/prisma");
const prismaMock = prisma;

jest.mock("../prisma/prisma", () => mockDeep());

beforeEach(() => {
  mockReset(prismaMock);
});

module.exports = { prismaMock };
