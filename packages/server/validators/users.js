const { param } = require("express-validator");

const UserController = require("../controllers/users");

const userIdValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .blacklist("<>")
    .isUUID()
    .withMessage("Invalid user ID provided")
    .custom(async (value) => {
      const user = await UserController.getUser(value);
      if (!user) {
        throw new Error("User with ID ${value} not found");
      }
      return true;
    }),
];

module.exports = {
  userIdValidator,
};
