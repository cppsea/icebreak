const { updateNewUser } = require("../../controllers/users");
const { prismaMock } = require("../prisma_mock");

describe("Onboarding User Unit Tests", () => {
  const userId = "testUserId";
  const userData = {
    name: "John",
    age: "25",
    email: "john@example.com",
  };

  const updatedUser = {
    userId: userId,
    name: "John",
    age: 25,
    email: "john@example.com",
    isNew: false,
  };

  test("should update user data and set isNew flag to false", async () => {
    prismaMock.user.update.mockResolvedValue(updatedUser);

    const result = await updateNewUser(userId, userData);

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: {
        userId: userId,
      },
      data: {
        ...userData,
        isNew: false,
      },
    });

    expect(result).toEqual(updatedUser);
  });
});
