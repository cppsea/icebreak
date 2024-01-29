const { param, body } = require("express-validator");

const EventController = require("../controllers/events");
const GuildController = require("../controllers/guilds");

const thumbnail_regex =
  /^https:\/\/icebreak-assets.s3.us-west-1.amazonaws.com\/.+\.(jpg|png|JPG|PNG|JPEG|jpeg)$/;

// validators are defined as an array of checks to perform with express-validator
const createEventValidator = [
  // example check for making sure guildId route parameter is a UUID
  // modify this param("guildId") check for the other checks I listed in the PR review for "guildId"
  param("guildId", "Invalid guild ID")
    .trim()
    .blacklist("<>")
    .exists({ checkFalsy: true })
    .withMessage("guildId cannot be null or empty")
    .isUUID()
    .withMessage("Not a UUID")
    .custom(async (value) => {
      try {
        await GuildController.getGuild(value); //Check if guild exists by getting it
      } catch (error) {
        //If event does not exists, then a NotFoundError is thrown from controller
        throw new Error(`No guild exists with an ID of ${value}`);
      }
    }),
  //Title checks
  body("title", "Invalid title")
    .trim()
    .blacklist("<>")
    .exists({ checkFalsy: true })
    .withMessage("Title cannot be null or empty")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title length must be between 1 to 255 characters"),

  //Description checks
  body("description", "Invalid description")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description max length is 2,000 characters"),

  //Location checks
  body("location", "Invalid location")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Location max length is 255 characters"),

  //Thumbnail checks
  body("thumbnail", "Invalid thumbnail")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Thumbnail max length is 255 characters")
    .matches(thumbnail_regex)
    .withMessage("Thumbnail is not a valid image file"),

  //Start Date checks
  body("startDate", "Invalid start date")
    .trim()
    .blacklist("<>")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date is not in a valid date format")
    .custom(async (startDate, { req }) => {
      //Start date given but not end date
      if (!req.body.endDate) {
        throw new Error("Cannot have start date without end date");
      }
    }),
  //End Date checks
  body("endDate", "Invalid end date")
    .trim()
    .blacklist("<>")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date is not in a valid date format")
    .custom(async (endDate, { req }) => {
      //End date given but no start date
      if (!req.body.startDate) {
        throw new Error("Cannot have end date without start date");
      }

      //Checks if both start and end date are given
      if (endDate < req.body.startDate) {
        throw new Error("End date cannot be before start date");
      }
    }),
];

const updateEventValidator = [
  //Title checks
  body("title", "Invalid title")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("Title length must be between 1 to 255 characters"),
  //Description checks
  body("description", "Invalid description")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description max length is 2000 characters"),
  //Location checks
  body("location", "Invalid location")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Location max length is 255 characters"),
  //Thumbnail checks
  body("thumbnail", "Invalid thumbnail")
    .trim()
    .blacklist("<>")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Thumbnail max length is 255 characters")
    .matches(thumbnail_regex)
    .withMessage("Thumbnail is not a valid image file"),
  //Start Date checks
  body("startDate", "Invalid start date")
    .trim()
    .blacklist("<>")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date is not in a valid date format")
    .custom(async (startDate, { req }) => {
      //Check for when new start and end date is given
      if (req.body.endDate) {
        let endDate = new Date(req.body.endDate);

        //Check if new start date is after new end date
        if (startDate > endDate) {
          throw new Error("New start date cannot be after new end date");
        }
      }
      //Check for when new start date is given but no end date
      else {
        const currEvent = await EventController.getEvent(req.params.eventId);

        //Check if the current end date is null
        if (currEvent.endDate == null) {
          throw new Error("Cannot update start date if end date is null");
        }
        //Check if new start date is after current end date
        else if (startDate > currEvent.endDate) {
          throw new Error("New start date cannot be after current end date");
        }
      }
    }),
  //End Date checks
  body("endDate", "Invalid end date")
    .trim()
    .blacklist("<>")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date is not in a valid date format")
    .custom(async (endDate, { req }) => {
      //Check for when new end date is given but no start date
      if (!req.body.startDate) {
        const currEvent = await EventController.getEvent(req.params.eventId);

        //Check if current start date is null
        if (currEvent.startDate == null) {
          throw new Error("Cannot update end date if start date is null");
        }
        //Check if new end date is before current start date
        else if (endDate < currEvent.startDate) {
          throw new Error("New end date cannot be before current start date");
        }
      }
      //Refer to start date checks for when new start and end dates are given
    }),
];

const eventIdValidator = [
  // eventId checks
  param("eventId", "Invalid event ID")
    .trim()
    .blacklist("<>")
    .isUUID()
    .withMessage("Not a UUID")
    .exists({ checkFalsy: true })
    .withMessage("Event Id cannot be null or empty")
    .custom(async (value) => {
      try {
        await EventController.getEvent(value); //Check if event exists by getting it
      } catch (error) {
        //If event does not exists, then a NotFoundError is thrown from controller
        throw new Error(`No event exists with an ID of ${value}`);
      }
    }),
];

module.exports = {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
};
