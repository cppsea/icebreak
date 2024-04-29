const { prismaMock } = require("../prisma_mock");
const { isUserEmail, isGoogleAccount } = require("../../controllers/auth");

describe("Forgot Password User Verification Unit Tests", () => {
  test("should return true if user email exists", async () => {
    const testEmail = "userthatexists@gmail.com";
    const testUser = {
      email: testEmail,
    };
    prismaMock.users.findUnique.mockResolvedValue(testUser);

    const result = await isUserEmail(testEmail);

    expect(result).toEqual(true);
  });

  test("should return false if user email does not exist", async () => {
    const testEmail = "userthatisnonexistent@example.com";
    prismaMock.users.findUnique.mockResolvedValue(null);

    const result = await isUserEmail(testEmail);

    expect(result).toEqual(false);
  });

  test("should return true if user is a Google account", async () => {
    const testUserId = "googlegeneratedaccountid";
    const testUser = {
      userId: testUserId,
      password: null,
    };
    prismaMock.users.findUnique.mockResolvedValue(testUser);

    const result = await isGoogleAccount(testUserId);

    expect(result).toEqual(true);
  });

  test("should return false if user is not a Google account", async () => {
    const testUserId = "nongooglegeneratedaccountid";
    const testUser = {
      userId: testUserId,
      password: "hashedPassword",
    };
    prismaMock.users.findUnique.mockResolvedValue(testUser);

    const result = await isGoogleAccount(testUserId);

    expect(result).toEqual(false);
  });
});
