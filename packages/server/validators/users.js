const { param, body } = require("express-validator");

const UserController = require("../controllers/users");
const EventController = require("../controllers/events");
const GuildController = require("../controllers/guilds");
const ALLOWED_PRONOUN = ["HeHim", "SheHer", "TheyThemTheir"];

const userIdValidator = [
  param("userId")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .blacklist("<>")
    .isUUID()
    .withMessage("Invalid user ID provided")
    .bail()
    .custom(async (value) => {
      try {
        await UserController.getUser(value);
      } catch (error) {
        throw new Error("User with ID ${value} not found");
      }
    }),
];

// validate userId in body instead of params
const userIdBodyValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .blacklist("<>")
    .isUUID()
    .withMessage("Invalid user ID provided")
    .bail()
    .custom(async (value) => {
      try {
        await UserController.getUser(value);
      } catch (error) {
        throw new Error("User with ID ${value} not found");
      }
    })
    .custom(async (userId, { req }) => {
      const eventId = req.params.eventId;
      const event = await EventController.getEvent(eventId);
      const isMember = await GuildController.isGuildMember(
        event.guildId,
        userId,
      );
      if (!isMember) {
        throw new Error("User is not a member of the guild.");
      }
    }),
];

const onboardingValidator = [
  // User ID Check: Must Exist, and be new onboarding user.
  param("userId")
    .notEmpty()
    .withMessage("User ID cannot be empty")
    .blacklist("<>")
    .isUUID()
    .withMessage("Invalid user ID provided")
    .bail()

    // check if user exists and hasn't completed onboarding
    .custom(async (value) => {
      try {
        const user = await UserController.getUser(value);
        if (user.isNew === false) {
          throw new Error("User already onboarded!");
        }
      } catch (error) {
        if (error.message === "User already onboarded!") {
          throw new Error("User already onboarded!");
        } else {
          throw new Error("User not found!");
        }
      }
    }),

  // First Name Check: exist, be between 1 and 50 chars
  body("firstName", "Invalid firstName.")
    .exists({ checkFalsy: true })
    .withMessage("firstName can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("firstName length must be between 1 to 50 characters.")
    .isAlpha()
    .withMessage("firstName should be Alphabetic characters."),

  // Last Name Check: exist, be between 1 and 50 chars
  body("lastName", "Invalid lastName.")
    .exists({ checkFalsy: true })
    .withMessage("firstName can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("lastName length must be between 1 to 50 characters."),

  // Pronoun Check: exist, be between 1 and 25 chars, and inside the allowed array.
  body("pronouns", "Invalid pronoun.")
    .exists({ checkFalsy: true })
    .withMessage("pronoun can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("pronoun length must be between 1 to 25 characters.")
    .isIn(ALLOWED_PRONOUN)
    .withMessage(
      "pronouns must be one of the allowed values: " +
        ALLOWED_PRONOUN.join(", "),
    ),

  // Major Check: exist, be between 1 and 100 chars
  body("major", "Invalid major.")
    .exists({ checkFalsy: true })
    .withMessage("major can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Major length must be between 1 to 100 characters."),

  // Avatar Check: exist, be between 1 and 255 chars, and is URL!
  body("avatar", "Invalid avatar.")
    .exists({ checkFalsy: true })
    .withMessage("avatar can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Name length must be between 1 to 255 characters.")
    .isURL()
    .withMessage("Must be an URL!")
    .matches(/(?:\.jpg|\.png)$/)
    .withMessage("Must be an image URL in .jpg or .png form!"),

  // Age Check: be greater than or equal to 16.
  body("age", "Invalid age.")
    .exists({ checkFalsy: true })
    .blacklist("<>")
    .trim()
    .toInt()
    .custom((value) => {
      if (value < 16) {
        throw new Error("Age must be greater than 16.");
      }
      return true;
    }),

  // Interests Check: Must be a populated array
  body("interests", "Invalid interests.")
    .blacklist("<>")
    .trim()
    .isArray({ min: 1 })
    .withMessage("Array can't be empty!")
    .exists({ checkFalsy: true })
    .withMessage("Interests can't be null or empty."),

  // validate each element in the interests array
  body("interests.*", "Invalid interests.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Must be alphabetical string!"),
];

module.exports = {
  userIdValidator,
  userIdBodyValidator,
  onboardingValidator,
};
