const { param, body } = require("express-validator");

const GuildController = require("../controllers/guilds");
const { s3ImagesUrlRegex } = require("../utils/s3");
const { GuildMemberRole } = require("@prisma/client");

const guildIdValidator = [
  // Guild ID & Existing Guild Checks
  param("guildId", "Invalid Guild ID.")
    .exists({ checkFalsy: true })
    .withMessage("Guild ID can't be null or empty.")
    .blacklist("<>")
    .trim()
    .escape()
    .isUUID()
    .withMessage("Guild ID not a valid UUID.")
    .bail()
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
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name length must be between 1 to 100 characters."),

  // Guild Handler Name Check
  body("handler", "Invalid guild handler name.")
    .exists({ checkFalsy: true })
    .withMessage("Guild handler's name can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Guild handler's name must be between 1 to 50 characters."),

  // Description Check
  body("description", "Invalid guild description.")
    .exists({ checkFalsy: true })
    .withMessage("Guild description can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Guild description max length is 2,000 characters."),

  // Category Check
  body("category", "Invalid guild category.")
    .exists({ checkFalsy: true })
    .withMessage("Guild category can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Category name max length is 255 characters."),

  // Location Check: OPTIONAl FOR GUILD CREATION
  body("location", "Invalid guild location.")
    .optional()
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location name max length is 255 characters."),

  // Website Check: OPTIONAL FOR GUILD CREATION
  body("website", "Invalid guild website.")
    .optional()
    .blacklist("<>")
    .trim()
    .isLength({ max: 2048 })
    .withMessage("Guild website max length is 2048 characters.")
    .isURL()
    .withMessage("Provided website url is invalid."),

  // Tags Check
  body("tags", "Invalid tags.")
    .optional()
    .blacklist("<>")
    .isArray()
    .withMessage("Tags must be an array."),

  // Banner Check
  body("banner", "Invalid guild banner.")
    .exists({ checkFalsy: true })
    .withMessage("Guild banner can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(s3ImagesUrlRegex)
    .withMessage("Not a valid image URL"),

  // Avatar Check
  body("avatar", "Invalid guild avatar.")
    .exists({ checkFalsy: true })
    .withMessage("Guild avatar can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(s3ImagesUrlRegex)
    .withMessage("Not a valid image URL"),

  // Media Check
  body("media", "Invalid guild media.")
    .blacklist("<>")
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
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name length must be between 1 to 100 characters."),

  // Guild Handler Name Check: OPTIONAl UPDATE
  body("handler", "Invalid guild handler name.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild handler's name can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Guild handler's name must be between 1 to 50 characters."),

  // Description Check: OPTIONAl UPDATE
  body("description", "Invalid guild description.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild description can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Guild description max length is 2,000 characters."),

  // Category Check: OPTIONAl UPDATE
  body("category", "Invalid guild category.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild category can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Category name max length is 255 characters."),

  // Location Check: OPTIONAl UPDATE
  body("location", "Invalid guild location.")
    .optional()
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location name max length is 255 characters."),

  // Website Check: OPTIONAl UPDATE
  body("website", "Invalid guild website.")
    .optional()
    .blacklist("<>")
    .trim()
    .isLength({ max: 2048 })
    .withMessage("Guild website max length is 2048 characters.")
    .isURL()
    .withMessage("Provided website url is invalid."),

  // Tags Check: OPTIONAl UPDATE
  body("tags", "Invalid tags.")
    .optional()
    .blacklist("<>")
    .isArray()
    .withMessage("Tags must be an array."),

  // Banner Check: OPTIONAl UPDATE
  body("banner", "Invalid guild banner.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild banner can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(s3ImagesUrlRegex)
    .withMessage("Not a valid image URL"),

  // Avatar Check: OPTIONAl UPDATE
  body("avatar", "Invalid guild avatar.")
    .optional()
    .exists({ checkFalsy: true })
    .withMessage("Guild avatar can't be null or empty.")
    .blacklist("<>")
    .trim()
    .isLength({ max: 255 })
    .withMessage("Guild thumbnail max length is 255 characters.")
    .matches(s3ImagesUrlRegex)
    .withMessage("Not a valid image URL"),

  // Media Check: OPTIONAl UPDATE
  body("media", "Invalid guild media.")
    .optional()
    .blacklist("<>")
    .isArray()
    .withMessage("Media must be an array."),

  // IsInviteOnly Check: OPTIONAl UPDATE
  body("isInviteOnly", "Invalid guild invitation mode.")
    .optional()
    .isBoolean()
    .withMessage("Invite mode must be set to true or false."),
];

const addGuildMemberValidator = [
  param("userId").custom(async (_, { req }) => {
    const { guildId, userId } = req.params;
    const client = req.user;

    const guildData = await GuildController.getGuild(guildId);
    const clientData = await GuildController.getGuildMember(
      guildId,
      client.userId,
    );

    if (
      !(await GuildController.isGuildMember(guildId, client.userId)) &&
      client.userId !== userId
    ) {
      throw new Error("Access denied. Non-members cannot add other users.");
    }

    if (await GuildController.isGuildMember(guildId, userId)) {
      throw new Error("Guild member already exists.");
    }

    // In a invite-only guild, fail if
    // - non-member attempts to join the guild
    // - unauth member attempts to add another user
    if (guildData.isInviteOnly) {
      if (
        client.userId === userId ||
        clientData.role === GuildMemberRole.Member
      ) {
        throw new Error(
          "Access denied. Only authorized members may add users to an invite-only guild.",
        );
      }
    }
  }),
];

const deleteGuildMemberValidator = [
  param("userId").custom(async (_, { req }) => {
    const { guildId, userId } = req.params;

    if (!(await GuildController.isGuildMember(guildId, userId))) {
      throw new Error("Guild member does not exist.");
    }

    const client = req.user;
    const clientData = await GuildController.getGuildMember(
      guildId,
      client.userId,
    );
    const userData = await GuildController.getGuildMember(guildId, userId);

    // Not auth if client is member or has an equal/lower role than the added user
    if (
      !clientData ||
      clientData.role === GuildMemberRole.Member ||
      userData.role >= clientData.role
    ) {
      throw new Error(
        "Access denied. User is not authorized to perform this function.",
      );
    }
  }),
];

const updateGuildMemberRoleValidator = [
  body("role", "Invalid Role.")
    .trim()
    .exists({ checkFalsy: true })
    .withMessage("Role can't be null or empty")
    .blacklist("<>")
    .matches(/^(?:Member|Officer|Owner)$/)
    .withMessage("Invalid role. Allowed values are: Member, Officer, or Owner"),
  param("userId").custom(async (_, { req }) => {
    const { guildId, userId } = req.params;
    const role = req.body.role;
    const client = req.user;
    const clientData = await GuildController.getGuildMember(
      guildId,
      client.userId,
    );

    if (!clientData || clientData.role !== GuildMemberRole.Owner) {
      throw new Error("Access denied. Only the guild owner can edit roles.");
    }
    if (!(await GuildController.isGuildMember(guildId, userId))) {
      throw new Error("Guild member does not exist.");
    }
    if (client.userId === userId) {
      throw new Error("The guild owner cannot edit their own role.");
    }
    if (role === GuildMemberRole.Owner) {
      await GuildController.updateGuildMemberRole(
        guildId,
        client.userId,
        GuildMemberRole.Member,
      );
    }
  }),
];

module.exports = {
  guildIdValidator,
  createGuildValidator,
  updateGuildValidator,
  addGuildMemberValidator,
  deleteGuildMemberValidator,
  updateGuildMemberRoleValidator,
};
