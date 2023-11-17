const {
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime/library");
const GuildsController = require("../../controllers/guilds");
const { prismaMock } = require("../prisma_mock");

describe("Guilds unit tests", () => {
  const testGuild = {
    guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
    name: "Software Engineering Association",
    handler: "sea",
    description: "test description",
    category: "software engineering",
  };

  test("should create new guild", async () => {
    prismaMock.guilds.create.mockResolvedValue(testGuild);

    await expect(GuildsController.createGuild(testGuild)).resolves.toEqual({
      guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
      name: "Software Engineering Association",
      handler: "sea",
      description: "test description",
      category: "software engineering",
    });
  });

  test("should fetch guild by id", async () => {
    prismaMock.guilds.findUniqueOrThrow.mockResolvedValue(testGuild);

    await expect(GuildsController.getGuild(testGuild.guildId)).resolves.toEqual(
      {
        guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
        name: "Software Engineering Association",
        handler: "sea",
        description: "test description",
        category: "software engineering",
      }
    );
  });

  test("should find no guild if given nonexistent id", async () => {
    prismaMock.guilds.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("record not found", { code: "P2025" })
    );

    await expect(
      GuildsController.getGuild("e2bdade9-4bf2-4220-8020-e09266363762")
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });
});
