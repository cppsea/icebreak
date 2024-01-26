const { param, body } = require("express-validator");

const GuildController = require("../controllers/guilds");

const getGuildValidator = [
  // Guild ID & Existing Guild Checks
  param("guildId", "Invalid Guild ID.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Guild ID can't be null or empty.")
    .isUUID()
    .withMessage("Guild ID not a valid UUID.")
    .custom(async (value) => {
      try {
        await GuildController.getGuild(value);
      } catch (error) {
        throw new Error(`No guild exists with an ID of ${value}`);
      }
    }),
];

const createGuildValidator = [
  // Guild ID & Existing Guild Checks
  param("guildId", "Invalid Guild ID.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Guild ID can't be null or empty.")
    .isUUID()
    .withMessage("Guild ID not a valid UUID.")
    .custom(async (value) => {
      try {
        await GuildController.getGuild(value);
      } catch (error) {
        throw new Error(`No guild exists with an ID of ${value}`);
      }
    }),

  // Name Check
  body("title", "Invalid title.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Title can't be null or empty.")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title length must be between 1 to 255 characters."),

  // Guild Handler Name Check
  body("handler", "Invalid guild handler name.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Guild handler's name can't be null or empty.")
    .isLength({ min: 1, max: 255 })
    .withMessage("Guild handler's name must be between 1 to 255 characters."),

  // Description Check
  body("description", "Invalid guild description.")
    .trim()
    .escape()
    .isLength({ max: 2000 })
    .withMessage("Guild description max length is 2,000 characters."),

  // Category Check
  body("category", "Invalid guild category.")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Category name max length is 255 characters."),

  // Location Check
  body("location", "Invalid guild location.")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Location name max length is 255 characters."),

  // Website Check
  body("website", "Invalid guild website.")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 2048 })
    .withMessage("Guild thumbnail max length is 2048 characters.")
    .matches(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
    .withMessage("Provided website url is invalid."),

  // Tags Check
  body("tags", "Invalid tags.").isArray().withMessage("Tags must be an array."),

  // Banner Check
  body("banner", "Invalid guild banner.")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Avatar Check
  body("avatar", "Invalid guild avatar.")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Media Check
  body("media", "Invalid guild media.")
    .isArray()
    .withMessage("Media must be an array."),

  // IsInviteOnly Check
  body("isInviteOnly", "Invalid guild invitation mode.")
    .isBoolean()
    .withMessage("Invite mode must be set to true or false."),
];

const updateGuildValidator = [
  // Guild ID & Existing Guild Checks
  param("guildId", "Invalid Guild ID.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Guild ID can't be null or empty.")
    .isUUID()
    .withMessage("Guild ID not a valid UUID.")
    .custom(async (value) => {
      try {
        await GuildController.getGuild(value);
      } catch (error) {
        throw new Error(`No guild exists with an ID of ${value}`);
      }
    }),

  // Name Check
  body("title", "Invalid title.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Title can't be null or empty.")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title length must be between 1 to 255 characters."),

  // Guild Handler Name Check
  body("handler", "Invalid guild handler name.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Guild handler's name can't be null or empty.")
    .isLength({ min: 1, max: 255 })
    .withMessage("Guild handler's name must be between 1 to 255 characters."),

  // Description Check
  body("description", "Invalid guild description.")
    .trim()
    .escape()
    .isLength({ max: 2000 })
    .withMessage("Guild description max length is 2,000 characters."),

  // Category Check
  body("category", "Invalid guild category.")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Category name max length is 255 characters."),

  // Location Check
  body("location", "Invalid guild location.")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Location name max length is 255 characters."),

  // Website Check
  body("website", "Invalid guild website.")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 2048 })
    .withMessage("Guild thumbnail max length is 2048 characters.")
    .matches(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
    .withMessage("Provided website url is invalid."),

  // Tags Check
  body("tags", "Invalid tags.").isArray().withMessage("Tags must be an array."),

  // Banner Check
  body("banner", "Invalid guild banner.")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Avatar Check
  body("avatar", "Invalid guild avatar.")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Media Check
  body("media", "Invalid guild media.")
    .isArray()
    .withMessage("Media must be an array."),

  // IsInviteOnly Check
  body("isInviteOnly", "Invalid guild invitation mode.")
    .isBoolean()
    .withMessage("Invite mode must be set to true or false."),
];
const deleteGuildValidator = [
  // Guild ID & Existing Guild Checks
  param("guildId", "Invalid Guild ID.")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Guild ID can't be null or empty.")
    .isUUID()
    .withMessage("Guild ID not a valid UUID.")
    .custom(async (value) => {
      try {
        await GuildController.getGuild(value);
      } catch (error) {
        throw new Error(`No guild exists with an ID of ${value}`);
      }
    }),
];

module.exports = {
  getGuildValidator,
  createGuildValidator,
  updateGuildValidator,
  deleteGuildValidator,
};
