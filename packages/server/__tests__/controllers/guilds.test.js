const {
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime/library");
const GuildsController = require("../../controllers/guilds");
const { prismaMock } = require("../prisma_mock");

describe("Guilds unit tests", () => {
  // Mock Input; An Existing Guild
  const testGuild = {
    guildId: "1f050f81-fbef-485a-84b2-516dfbb3d0da",
    name: "Software Engineering Association",
    handler: "sea",
    description: "test description",
    category: "software engineering",
  };

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
    icon: "appleicon.jpeg"
  };

    /*
  Unit Tests: Fetch Guild By ID
  - Successfully fetching guild by ID ✅
  - Fetching a guild with an invalid ID that doesn't exist in database (should throw error) ✅
  */

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

    /*
  Unit Tests: Creating Guilds
  - Successfully creating guild ✅
  - Trying to create a guild without the required fields (should throw error) ✅
  NOTE: use objectContaining to test for specific fields in the guildObject ✅
  */
 
  test("should sucessfully create new guild", async () => {
    prismaMock.guilds.create.mockResolvedValue(testCreateGuild);

    await expect(GuildsController.createGuild(testCreateGuild)).resolves.toEqual(
      expect.objectContaining(testCreateGuild)
    )
  });

  test("should fail guild creation due to missing required fields", async () => {
    prismaMock.guilds.create.mockResolvedValue( 
      new PrismaClientKnownRequestError("Missing required field error", {code: "P2012"})
    );

    await expect(
      GuildsController.createGuild(testinvalidCreateGuild)).resolves.toThrow(
        PrismaClientKnownRequestError
      )
  });

  /*
  Unit Tests: Updating Guilds
  - Successfully updating multiple guild properties
  - Successfully updating one guild property
  - Trying to update a noneixstent guild property (should throw error)
  - Trying to update a nonexistent guild (should throw error)
  */
  test("should update multiple guild properties successfully", async () => {
    prismaMock.guilds.update.mockResolvedValue("e2bdade9-4bf2-4220-8020-e09266363762", testGuild);

    // for testing
    console.log(await GuildsController.updateGuild("e2bdade9-4bf2-4220-8020-e09266363762",testGuild)) // returning  "e2bdade9-4bf2-4220-8020-e09266363762"

    await expect(GuildsController.updateGuild("e2bdade9-4bf2-4220-8020-e09266363762",testGuild)).resolves.toEqual(
      expect.objectContaining("placeholder")
    )
  });

  // test("should update only one guild property sucessfully", async () => {
  //   prismaMock.guilds.update.mockResolvedValue(testGuild);

  //   await expect(GuildsController.updateGuild(testGuild)).resolves.toEqual(
  //     expect.objectContaining(testGuild)
  //   )
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
