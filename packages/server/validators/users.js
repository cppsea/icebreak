const { param, body } = require("express-validator");

const UserController = require("../controllers/users");
const EventController = require("../controllers/events");
const GuildController = require("../controllers/guilds");

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

module.exports = {
  userIdValidator,
  userIdBodyValidator,
};
