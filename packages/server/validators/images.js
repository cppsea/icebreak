const { body, param } = require("express-validator");
const UserController = require("../controllers/users");
const GuildController = require("../controllers/guilds");
const EventController = require("../controllers/events");

const imageTypeRegex =
  /(user_avatar|guild_avatar|guild_banner|event_thumbnail)/;
const jpegPrefixRegex = /\/9j\/.*/;

const entityValidator = [
  param("imageType")
    .trim()
    .blacklist("<>")
    .matches(imageTypeRegex)
    .withMessage("Invalid image type"),
  param("entityUUID")
    .trim()
    .blacklist("<>")
    .isUUID()
    .withMessage("Invalid UUID provided")
    .bail()
    .custom(async (entityUUID, { req }) => {
      switch (req.params.imageType) {
        case "user_avatar":
          await UserController.getUser(entityUUID).catch(() => {
            throw new Error(`No user exists with an ID of ${entityUUID}`);
          });
          break;
        case "guild_avatar":
        case "guild_banner":
          await GuildController.getGuild(entityUUID).catch(() => {
            throw new Error(`No guild exists with an ID of ${entityUUID}`);
          });
          break;
        case "event_banner":
          await EventController.getEvent(entityUUID).catch(() => {
            throw new Error(`No event exists with an ID of ${entityUUID}`);
          });
          break;
      }
    }),
];

const jpegBase64Validator = body("jpegBase64")
  .trim()
  .isBase64()
  .matches(jpegPrefixRegex)
  .withMessage("Invalid Base64 JPEG data");
module.exports = { entityValidator, jpegBase64Validator };
