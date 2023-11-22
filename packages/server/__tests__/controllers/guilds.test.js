const {
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime/library");
const GuildsController = require("../../controllers/guilds");
const { prismaMock } = require("../prisma_mock");

describe("Guilds Unit Tests", () => {
  /*
  Unit Tests: Fetch Guild By ID
  - Successfully fetching guild by ID ✅
  - Fetching a guild with an invalid ID that doesn't exist in database (should throw error) ✅
  */

  // Define Test Data For Fetching By ID
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

  test("should find no guild if given nonexistent id", async () => {
    prismaMock.guilds.findUniqueOrThrow.mockRejectedValue(
      new PrismaClientKnownRequestError("record not found", { code: "P2025" })
    );

    await expect(
      GuildsController.getGuild("e2bdade9-4bf2-4220-8020-e09266363762")
    ).rejects.toThrow(PrismaClientKnownRequestError);
  });

  /*
  Unit Tests: Creating Guilds
  - Successfully creating guild ✅
  - Trying to create a guild without the required fields (should throw error) ✅
  NOTE: use objectContaining to test for specific fields in the guildObject ✅
  */

  test("should sucessfully create new guild", async () => {
    // Define Test Data For Create
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

  test("should fail guild creation due to missing required fields", async () => {
    const testinvalidCreateGuild = {
      location: "San Diego",
      website: "apple.com",
      banner: "apple.jpeg",
      icon: "appleicon.jpeg",
    };

    prismaMock.guilds.create.mockResolvedValue(
      new PrismaClientKnownRequestError("Missing required field error", {
        code: "P2012",
      })
    );

    await expect(
      GuildsController.createGuild(testinvalidCreateGuild)
    ).resolves.toThrow(PrismaClientKnownRequestError);
  });

  /*
  Unit Tests: Updating Guilds
  - Successfully updating multiple guild properties ✅
  - Successfully updating one guild property ✅
  - Trying to update a noneixstent guild property (should throw error)
  - Trying to update a nonexistent guild (should throw error)
  */

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

  /*
  Unit Tests: Deleting Guilds
  - Successfully deleting guild by ID
  - Trying to delete a nonexistent guild (should throw error)
  */

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
