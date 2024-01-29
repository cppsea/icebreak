const { param } = require("express-validator");
const EventController = require("../controllers/events");

const eventAttendeesValidator = [
  param("eventId")
    .trim()
    .blacklist("<>")
    .isUUID()
    .withMessage((eventId) => `Given eventId ${eventId} is invalid.`)
    .bail()
    .custom(async (eventId) => {
      if (!(await EventController.existsInPrisma(eventId))) {
        throw new Error(`No event exists with an ID of ${eventId}`);
      }
    }),
];

module.exports = {
  eventAttendeesValidator,
};
