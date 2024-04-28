const { param, body } = require("express-validator");

const UserController = require("../controllers/users");
const EventController = require("../controllers/events");
const GuildController = require("../controllers/guilds");
const ALLOWED_PRONOUN = ["he/him", "she/her", "they/them"];

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

const updateNewUserValidator = [
  // First Name Check: exist, be between 1 and 50 chars, match URL regex
  body("firstName", "Invalid firstName.")
    .exists({ checkFalsy: true })
    .withMessage("firstName can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("firstName length must be between 1 to 255 characters.")
    .isAlpha()
    .withMessage("firstName should be Alphabetic characters.")
    .withMessage("Must be an URL"),

  // Last Name Check: exist, be between 1 and 50 chars, match URL regex
  body("lastName", "Invalid lastName.")
    .exists({ checkFalsy: true })
    .withMessage("firstName can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("lastName length must be between 1 to 50 characters.")
    .withMessage("Must be an URL"),

  // Pronoun Check: exist, be between 1 and 255 chars
  body("pronoun", "Invalid pronoun.")
    .exists({ checkFalsy: true })
    .withMessage("pronoun can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("pronoun length must be between 1 to 255 characters.")
    .isIn(ALLOWED_PRONOUN)
    .withMessage(
      "pronouns must be one of the allowed values: " +
        ALLOWED_PRONOUN.join(", "),
    ),

  // Major Check: exist, be between 1 and 255 chars, match URL regex
  body("major", "Invalid major.")
    .exists({ checkFalsy: true })
    .withMessage("major can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Major length must be between 1 to 255 characters."),

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
  userIdBodyValidator,
  updateNewUserValidator,
};
