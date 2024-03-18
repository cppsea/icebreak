const express = require("express");
const router = express.Router();
const EventController = require("../../controllers/events");
const AuthController = require("../../controllers/auth");
const {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
  checkInTimeValidator,
  attendeeStatusValidator,
} = require("../../validators/events");
const { userIdBodyValidator } = require("../../validators/users");
const { validationResult, matchedData } = require("express-validator");
const DEFAULT_EVENT_LIMIT = 10;
/**
 * cursor is base-64 encoded and formatted as
 * current page___(prev or next)___event_id reference,
 * for example, 1___next___384629bffb28f2
 * (3 underscores separator)
 */
router.get(
  "/pages/:cursor?",
  AuthController.authenticate,
  async (request, response) => {
    try {
      if (request.query.limit && isNaN(request.query.limit)) {
        return response.status(400).json({
          status: "fail",
          data: {
            limit: "Total event limit for a page must be a number",
          },
        });
      }

      const eventLimit = parseInt(request.query.limit) || DEFAULT_EVENT_LIMIT;
      // base64 decode cursor parameter if not null
      const requestCursor = request.params.cursor
        ? Buffer.from(request.params.cursor, "base64").toString()
        : "";
      let [currentPage, action, eventId] = requestCursor.split("___");
      currentPage = parseInt(currentPage) || 1;
      const events = await EventController.getEvents(
        eventLimit,
        action,
        eventId
      );

      if (events.length === 0) {
        throw new Error("Tried to access nonexistent page");
      }

      // generate cursors for previous and next pages
      // const firstEventId = events[0].event_id;
      // const lastEventId = events[events.length - 1].event_id;
      const firstEventId = events[0].eventId;
      const lastEventId = events[events.length - 1].eventId;
      const prevCursor = Buffer.from(
        `${currentPage - 1}___prev___${firstEventId}`
      ).toString("base64");
      const nextCursor = Buffer.from(
        `${currentPage + 1}___next___${lastEventId}`
      ).toString("base64");

      // follow-up request, not first request to api route
      if (currentPage && action && eventId) {
        response.status(200).json({
          status: "success",
          data: {
            events: events,
            cursor: {
              previousPage: `http://localhost:5050/api/events/pages/${prevCursor}?limit=${eventLimit}`,
              nextPage: `http://localhost:5050/api/events/pages/${nextCursor}?limit=${eventLimit}`,
            },
          },
        });
      } else {
        // first request made to this route, determine total number of pages
        // null previous cursor on first page
        const totalPages = await EventController.getPages(eventLimit);

        response.status(200).json({
          status: "success",
          data: {
            events: events,
            totalPages: totalPages,
            cursor: {
              previousPage: null,
              nextPage: `http://localhost:5050/api/events/pages/${nextCursor}?limit=${eventLimit}`,
            },
          },
        });
      }
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.post(
  //Router to create events
  "/:guildId",
  AuthController.authenticate,
  createEventValidator,
  async (request, response) => {
    // access validation results
    const result = validationResult(request);

    // if validation result is not empty, errors occurred
    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array(),
      });
      return;
    }

    const data = matchedData(request);

    const guildId = data.guildId;
    const eventData = data;

    try {
      const newEvent = await EventController.createEvent(eventData, guildId);
      response.status(200).json({
        status: "success",
        event: newEvent,
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.get(
  "/:eventId",
  eventIdValidator,
  AuthController.authenticate,
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array(),
      });
      return;
    }

    try {
      const validatedData = matchedData(request);
      const eventId = validatedData.eventId;
      const event = await EventController.getEvent(eventId);
      response.status(200).json({
        status: "success",
        data: {
          event: event,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.delete(
  "/:eventId",
  AuthController.authenticate,
  eventIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    // if validation result is not empty, errors occurred
    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array(),
      });
      return;
    }

    try {
      const validatedData = matchedData(request);
      const eventId = validatedData.eventId;
      const deletedEvent = await EventController.deleteEvent(eventId);
      if (deletedEvent) {
        response.status(200).json({
          status: "success",
          data: null,
        });
      }
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.put(
  //Route handler to update event
  "/:eventId",
  AuthController.authenticate,
  eventIdValidator,
  updateEventValidator,
  async (request, response) => {
    // access validation results
    const result = validationResult(request);

    // if validation result is not empty, errors occurred
    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array(),
      });
      return;
    }

    try {
      const validatedData = matchedData(request);
      const eventId = validatedData.eventId;

      const updatedEvent = await EventController.updateEvent(
        eventId,
        validatedData
      );

      response.status(200).json({
        status: "success",
        data: {
          event: updatedEvent,
        },
      });
    } catch (error) {
      //Any error that happens in the update controller will be caught and handled here
      //For now just respond with the error message
      response.status(500).json({
        status: "error",
        message: error.message,
      });
      return;
    }
  }
);

router.get(
  "/:eventId/attendees",
  AuthController.authenticate,
  eventIdValidator,
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: errors.array(),
      });
    }
    try {
      const { eventId } = matchedData(request);
      const eventAttendeesData = await EventController.getEventAttendees(
        eventId
      );
      response.status(200).json({
        status: "success",
        data: {
          eventAttendees: eventAttendeesData,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.post(
  "/:eventId/check-in",
  AuthController.authenticate,
  userIdBodyValidator,
  checkInTimeValidator,
  async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: errors.array(),
      });
      return;
    }

    try {
      const { userId, eventId } = matchedData(request);
      const eventAttendeeData = await EventController.updateAttendeeStatus(
        eventId,
        userId,
        "CheckedIn"
      );

      response.status(200).json({
        status: "success",
        data: {
          eventRegistration: eventAttendeeData,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.put(
  "/:eventId/status",
  AuthController.authenticate,
  eventIdValidator,
  attendeeStatusValidator,
  userIdBodyValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array(),
      });
      return;
    }

    const data = matchedData(request);

    const userId = data.userId;
    const eventId = data.eventId;
    const status = data.status;

    try {
      const updatedEventAttendeeStatus =
        await EventController.updateAttendeeStatus(eventId, userId, status);

      response.status(200).json({
        status: "success",
        data: { eventAttendee: updatedEventAttendeeStatus },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

module.exports = router;
