const { param, body, check } = require("express-validator");

const EventController = require("../controllers/events");
const GuildController = require("../controllers/guilds");

// validators are defined as an array of checks to perform with express-validator
const createEventValidator = [
  // example check for making sure guildId route parameter is a UUID
  // modify this param("guildId") check for the other checks I listed in the PR review for "guildId"
  param("guildId", "Invalid guild ID")
    .trim()
    .escape()
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
  //   add more checks for the create event route below this line as part of this array

  //Title checks
  body("title", "Invalid title")
    .trim()
    .escape()
    .exists({ checkFalsy: true })
    .withMessage("Title cannot be null or empty")
    .isLength({ min: 1, max: 255 })
    .withMessage("Title length must be between 1 to 255 characters"),

  //Description checks
  body("description", "Invalid description")
    .trim()
    .escape()
    .isLength({ max: 2000 })
    .withMessage("Description max length is 2,000 characters"),

  //Location checks
  body("location", "Invalid location")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Location max length is 255 characters"),

  //Thumbnail checks
  body("thumbnail", "Invalid thumbnail")
    .trim()
    .escape()
    .isLength({ max: 255 })
    .withMessage("Thumbnail max length is 255 characters")
    .custom(async (value) => {
      if (!/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/.test(value)) {
        throw new Error("Thumbnail is not a valid image file");
      }
    }),

  //Start Date checks
  //Convert end date to a Date object for easier comparison
  check("endDate").toDate(),
  body("startDate", "Invalid dates")
    .trim()
    .escape()
    .isISO8601()
    .toDate()
    .withMessage("Start date is not in a valid date format")
    .custom(async (startDate, { req }) => {
      //If new end date is provided, check if start date is before the end date
      if (req.body.endDate) {
        if (startDate > req.body.endDate) {
          throw new Error("Start date is after new end date");
        }
      }
    }),

  //End Date checks
  //Similar checks to start sate but makes sure end date is after the start
  check("startDate").toDate(),
  body("endDate", "Invalid end date")
    .trim()
    .escape()
    .isISO8601()
    .toDate()
    .withMessage("End date is not in a valid date format")
    .custom(async (endDate, { req }) => {
      if (req.body.startDate) {
        if (endDate < req.body.startDate) {
          throw new Error("End date is before new start date");
        }
      }
    }),
];

const updateEventValidator = [
  //Event Id checks
  param("eventId", "Invalid event ID")
    .trim()
    .escape()
    .isUUID()
    .withMessage("Not a UUID")
    .exists({ checkFalsy: true })
    .withMessage("Event Id cannot be null or empty")
    .custom(async (value) => {
      try {
        await EventController.getEvent(value); //Check if event exists by getting it
      } catch (error) {
        //If event does not exists, then a NotFoundError is thrown from controller
        throw new Error(error);
      }
    }),
  //Title checks
  body("title", "Invalid title")
    .trim()
    .escape()
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage("Title length must be between 1 to 255 characters"),
  //Description checks
  body("description", "Invalid description")
    .trim()
    .escape()
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description max length is 2,000 characters"),
  //Location checks
  body("location", "Invalid location")
    .trim()
    .escape()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Location max length is 255 characters"),
  //Thumbnail checks
  body("thumbnail", "Invalid thumbnail")
    .trim()
    .escape()
    .optional()
    .isLength({ max: 255 })
    .withMessage("Thumbnail max length is 255 characters")
    .custom(async (value) => {
      if (!/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/.test(value)) {
        throw new Error("Thumbnail is not a valid image file");
      }
    }),
  //Start Date checks
  //Convert end date to a Date object for easier comparison
  check("endDate").optional().toDate(),
  body("startDate", "Invalid dates")
    .trim()
    .escape()
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date is not in a valid date format")
    .custom(async (startDate, { req }) => {
      //If new end date is provided, check if start date is before the end date
      if (req.body.endDate) {
        if (startDate > req.body.endDate) {
          throw new Error("Start date is after new end date");
        }
      } else {
        //Checks if new start date is before kept end date
        const currEvent = await EventController.getEvent(req.params.eventId);
        if (currEvent.endDate != null && startDate > currEvent.endDate) {
          throw new Error("Start date is after end date");
        }
      }
    }),
  //End Date checks
  //Similar checks to start sate but makes sure end date is after the start
  check("startDate").optional().toDate(),
  body("endDate", "Invalid end date")
    .trim()
    .escape()
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date is not in a valid date format")
    .custom(async (endDate, { req }) => {
      if (req.body.startDate) {
        if (endDate < req.body.startDate) {
          throw new Error("End date is before new start date");
        }
      } else {
        const currEvent = await EventController.getEvent(req.params.eventId);
        if (currEvent.startDate != null && endDate < currEvent.startDate) {
          throw new Error("End date is before start date");
        }
      }
    }),
];

const eventIdValidator = [
  // eventId checks
  param("eventId", "Invalid event ID")
    .trim()
    .escape()
    .isUUID()
    .withMessage("Not a UUID")
    .exists({ checkFalsy: true })
    .withMessage("Event Id cannot be null or empty")
    .custom(async (value) => {
      try {
        await EventController.getEvent(value); //Check if event exists by getting it
      } catch (error) {
        //If event does not exists, then a NotFoundError is thrown from controller
        throw new Error(error);
      }
    }),
];

module.exports = {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
};
