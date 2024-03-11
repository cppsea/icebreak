const { param, body } = require("express-validator");

const UserController = require("../controllers/users");

const userIdValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .blacklist("<>")
    .isUUID()
    .withMessage("Invalid user ID provided")
    .custom(async (value) => {
      try {
        await UserController.getUser(value);
      } catch (error) {
        throw new Error("User with ID ${value} not found");
      }
    }),
];

const updateNewUserValidator = [
  // Avatar Check: exist, be between 1 and 255 chars, match URL regex
  body("avatar", "Invalid avatar.")
    .exists({ checkFalsy: true })
    .withMessage("avatar can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Name length must be between 1 to 255 characters.")
    .isURL()
    .withMessage("Must be an URL"),

  // Age Check: be greater than or equal to 16
  body("age", "Invalid age.")
    .exists({ checkFalsy: true })
    .blacklist("<>")
    .trim()
    .custom((value) => {
      if (value < 16) {
        throw new Error("Age must be greater than 16.");
      }
      return true;
    }),

  // Interests Check: exist, be between 1 and 255 chars, not include "<>",
  body("interests", "Invalid interests.")
    .blacklist("<>")
    .trim()
    .isArray()
    .withMessage("Must be an array.")
    .exists({ checkFalsy: true })
    .withMessage("interests can't be null or empty."),
];

module.exports = {
  userIdValidator,
  updateNewUserValidator,
};
