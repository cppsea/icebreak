const {
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime/library");
const GuildsController = require("../../controllers/guilds");
const { prismaMock } = require("../prisma_mock");

describe("Guilds Unit Tests", () => {
  test("should fetch guild by id", async () => {
    const testFetchGuild = {
      guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
      name: "Software Engineering Association",
      handler: "sea",
      description: "test description",
      category: "software engineering",
    };
    prismaMock.guilds.findUniqueOrThrow.mockResolvedValue(testFetchGuild);

    await expect(
      GuildsController.getGuild(testFetchGuild.guildId)
    ).resolves.toEqual({
      guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
      name: "Software Engineering Association",
      handler: "sea",
      description: "test description",
      category: "software engineering",
    });
  });

  test("should throw error if no guild has given id", async () => {
    prismaMock.guilds.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("record not found", { code: "P2025" })
    );

    await expect(
      GuildsController.getGuild("e2bdade9-4bf2-4220-8020-e09266363762")
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  test("should sucessfully create new guild", async () => {
    const testCreateGuild = {
      name: "Software Engineering Association",
      handler: "sea",
      description: "test description",
      category: "software engineering",
    };

    prismaMock.guilds.create.mockResolvedValue(testCreateGuild);

    await expect(
      GuildsController.createGuild(testCreateGuild)
    ).resolves.toEqual(expect.objectContaining(testCreateGuild));
  });

  test("should throw error/fail guild creation due to missing required fields in body.", async () => {
    const testinvalidCreateGuild = {
      location: "San Diego",
      website: "apple.com",
      banner: "apple.jpeg",
      icon: "appleicon.jpeg",
    };

    prismaMock.guilds.create.mockRejectedValue(
      new PrismaClientKnownRequestError("Missing required field error", {
        code: "P2012",
      })
    );

    await expect(
      GuildsController.createGuild(testinvalidCreateGuild)
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  test("should update multiple guild properties successfully", async () => {
    const initial = {
      name: "Apple",
      handler: "Tim Cook",
      description: "Come buy our overpriced iphones.",
      category: "Guild Category",
      location: "Optional Location",
      website: "Optional Website",
      tags: ["Tag1", "Tag2", "apple 15"],
      banner: "URL to Banner Image",
      icon: "URL to Icon Image",
      media: ["Media1", "Media2", "Media3"],
      isInviteOnly: true,
    };

    const expected = {
      guildId: "308b5bc4-7771-4514-99b7-9611cefb7e1d",
      name: "Apple",
      handler: "Tim Cook",
      description: "Come buy our overpriced iphones.",
      category: "Guild Category",
      location: "Optional Location",
      website: "Optional Website",
      tags: ["Tag1", "Tag2", "apple 15"],
      banner: "URL to Banner Image",
      icon: "URL to Icon Image",
      media: ["Media1", "Media2", "Media3"],
      isInviteOnly: true,
    };

    prismaMock.guilds.update.mockResolvedValue(expected);

    const result = await GuildsController.updateGuild(
      "308b5bc4-7771-4514-99b7-6666cefb7e1d",
      initial
    );

    expect(result).toEqual(expect.objectContaining(expected));
  });

  test("should update one guild property successfully", async () => {
    const initial = {
      name: "Facebook",
    };

    const expected = {
      guildId: "308b5bc4-7771-4514-99b7-9611cefb7e1d",
      name: "Facebook",
    };

    prismaMock.guilds.update.mockResolvedValue(expected);

    const result = await GuildsController.updateGuild(
      "308b5bc4-7771-4514-99b7-6666cefb7e1d",
      initial
    );

    expect(result).toEqual(expect.objectContaining(expected));
  });

  test("should successfully delete a target guild", async () => {
    const guildIdToDelete = "308b5bc4-7771-4514-99b7-6666cefb7e1d";

    const mockGuild = {
      id: "308b5bc4-7771-4514-99b7-6666cefb7e1d",
      name: "Testing Delete Guild",
    };
    prismaMock.guilds.delete.mockResolvedValue(mockGuild);

    const result = await GuildsController.deleteGuild(guildIdToDelete);

    expect(result).toEqual(mockGuild);
  });
});
