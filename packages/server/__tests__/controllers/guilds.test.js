const {
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime/library");
const GuildsController = require("../../controllers/guilds");
const { prismaMock } = require("../prisma_mock");

describe("Guilds unit tests", () => {
  // Mock Input; An Existing Guild
  const GeneraltestGuild = {
    guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
    name: "Software Engineering Association",
    handler: "sea",
    description: "test description",
    category: "software engineering",
  };

  /*
  Unit Tests: Fetch Guild By ID
  - Successfully fetching guild by ID ✅
  - Fetching a guild with an invalid ID that doesn't exist in database (should throw error) ✅
  */

  test("should fetch guild by id", async () => {
    prismaMock.guilds.findUniqueOrThrow.mockResolvedValue(GeneraltestGuild);

    await expect(
      GuildsController.getGuild(GeneraltestGuild.guildId)
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
  const testCreateGuild = {
    name: "Software Engineering Association",
    handler: "sea",
    description: "test description",
    category: "software engineering",
  };

  const testinvalidCreateGuild = {
    location: "San Diego",
    website: "apple.com",
    banner: "apple.jpeg",
    icon: "appleicon.jpeg",
  };

  test("should sucessfully create new guild", async () => {
    prismaMock.guilds.create.mockResolvedValue(testCreateGuild);

    await expect(
      GuildsController.createGuild(testCreateGuild)
    ).resolves.toEqual(expect.objectContaining(testCreateGuild));
  });

  test("should fail guild creation due to missing required fields", async () => {
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
  - Successfully updating multiple guild properties
  - Successfully updating one guild property
  - Trying to update a noneixstent guild property (should throw error)
  - Trying to update a nonexistent guild (should throw error)
  */
  const initialMultipleUpdateGuildResponse = {
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

  const expectedUpdateGuildResponse = {
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

  test("should update multiple guild properties successfully", async () => {
    prismaMock.guilds.update.mockResolvedValue(expectedUpdateGuildResponse);

    const result = await GuildsController.updateGuild(
      "308b5bc4-7771-4514-99b7-9611cefb7e1d",
      initialMultipleUpdateGuildResponse
    );

    console.log(result);

    expect(result).toEqual(
      expect.objectContaining(expectedUpdateGuildResponse)
    );
  });

  // test("should update one guild property successfully", async () => {
  //   prismaMock.guilds.update.mockResolvedValue(expectedMultipleUpdateGuildResponse);

  //   const result = await GuildsController.updateGuild(
  //     "308b5bc4-7771-4514-99b7-9611cefb7e1d",
  //     expectedMultipleUpdateGuildResponse
  //   );

  //   await expect(result).toEqual(
  //     expect.objectContaining(expectedMultipleUpdateGuildResponse)
  //   );
  // });

  // test("should fail attempting to update an nonexistent guild property", async () => {
  //   prismaMock.guilds.update.mockResolvedValue(
  //     new PrismaClientKnownRequestError("Missing required field error", {code: "P2012"})
  //   );

  //   await expect(
  //     GuildsController.updateGuild(testGuild)).resolves.toThrow(
  //       PrismaClientKnownRequestError
  //     )
  // });

  // test("should fail attempting to update an nonexistent guild", async () => {
  //   prismaMock.guilds.update.mockResolvedValue(
  //     new PrismaClientKnownRequestError("Missing required field error", {code: "P2012"})
  //   );

  //   await expect(
  //     GuildsController.updateGuild(testGuild)).resolves.toThrow(
  //       PrismaClientKnownRequestError
  //     )
  // });

  /*
  Unit Tests: Deleting Guilds
  - Successfully deleting guild by ID
  - Trying to delete a nonexistent guild (should throw error)
  */
});
