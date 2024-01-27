const { param, body } = require("express-validator");

const GuildController = require("../controllers/guilds");

const guildIdValidator = [
  // Guild ID & Existing Guild Checks
  param("guildId", "Invalid Guild ID.")
    .exists({ checkFalsy: true })
    .withMessage("Guild ID can't be null or empty.")
    .trim()
    .escape()
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
  // Name Check
  body("name", "Invalid guild name.")
    .exists({ checkFalsy: true })
    .withMessage("Name can't be null or empty.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name length must be between 1 to 100 characters."),

  // Guild Handler Name Check
  body("handler", "Invalid guild handler name.")
    .exists({ checkFalsy: true })
    .withMessage("Guild handler's name can't be null or empty.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Guild handler's name must be between 1 to 50 characters."),

  // Description Check
  body("description", "Invalid guild description.")
    .exists({ checkFalsy: true })
    .withMessage("Guild description can't be null or empty.")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Guild description max length is 2,000 characters."),

  // Category Check
  body("category", "Invalid guild category.")
    .exists({ checkFalsy: true })
    .withMessage("Guild category can't be null or empty.")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Category name max length is 255 characters."),

  // Location Check: OPTIONAl FOR GUILD CREATION
  body("location", "Invalid guild location.")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location name max length is 255 characters."),

  // Website Check: OPTIONAL FOR GUILD CREATION
  body("website", "Invalid guild website.")
    .optional()
    .trim()
    .isLength({ max: 2048 })
    .withMessage("Guild website max length is 2048 characters.")
    .isURL()
    .withMessage("Provided website url is invalid."),

  // Tags Check
  body("tags", "Invalid tags.")
    .optional()
    .isArray()
    .withMessage("Tags must be an array."),

  // Banner Check
  body("banner", "Invalid guild banner.")
    .exists({ checkFalsy: true })
    .withMessage("Guild banner can't be null or empty.")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Avatar Check
  body("avatar", "Invalid guild avatar.")
    .exists({ checkFalsy: true })
    .withMessage("Guild avatar can't be null or empty.")
    .trim()
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
  // Name Check: OPTIONAl UPDATE
  body("name", "Invalid guild name.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Name can't be null or empty.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name length must be between 1 to 100 characters."),

  // Guild Handler Name Check: OPTIONAl UPDATE
  body("handler", "Invalid guild handler name.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild handler's name can't be null or empty.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Guild handler's name must be between 1 to 50 characters."),

  // Description Check: OPTIONAl UPDATE
  body("description", "Invalid guild description.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild description can't be null or empty.")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Guild description max length is 2,000 characters."),

  // Category Check: OPTIONAl UPDATE
  body("category", "Invalid guild category.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild category can't be null or empty.")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Category name max length is 255 characters."),

  // Location Check: OPTIONAl UPDATE
  body("location", "Invalid guild location.")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location name max length is 255 characters."),

  // Website Check: OPTIONAl UPDATE
  body("website", "Invalid guild website.")
    .optional()
    .trim()
    .isLength({ max: 2048 })
    .withMessage("Guild website max length is 2048 characters.")
    .isURL()
    .withMessage("Provided website url is invalid."),

  // Tags Check: OPTIONAl UPDATE
  body("tags", "Invalid tags.")
    .optional()
    .isArray()
    .withMessage("Tags must be an array."),

  // Banner Check: OPTIONAl UPDATE
  body("banner", "Invalid guild banner.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild banner can't be null or empty.")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Avatar Check: OPTIONAl UPDATE
  body("avatar", "Invalid guild avatar.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild avatar can't be null or empty.")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(/.*\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)
    .withMessage("Uploaded file is not a valid image."),

  // Media Check: OPTIONAl UPDATE
  body("media", "Invalid guild media.")
    .optional()
    .isArray()
    .withMessage("Media must be an array."),

  // IsInviteOnly Check: OPTIONAl UPDATE
  body("isInviteOnly", "Invalid guild invitation mode.")
    .optional()
    .isBoolean()
    .withMessage("Invite mode must be set to true or false."),
];

module.exports = {
  guildIdValidator,
  createGuildValidator,
  updateGuildValidator,
};
