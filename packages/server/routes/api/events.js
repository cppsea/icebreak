const express = require("express");
const router = express.Router();

const EventController = require("../../controllers/events");
const AuthController = require("../../controllers/auth");

router.get('/', async (request, response) => {
  try {
    const events = await EventController.getAllEvents();
    response.send(events);
  } catch(error) {
    response.send({
      success: false,
      message: error.message
    });
  }
});

router.get('/:eventId', AuthController.authenticate, async (request, response) => {
  try {
    console.log("@user", request.user);
    const { eventId } = request.params;
    const event = await EventController.getEvent(eventId);
    response.send(event);
  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});

module.exports = router;