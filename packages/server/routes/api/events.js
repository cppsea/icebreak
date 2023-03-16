const express = require("express");
const router = express.Router();

const EventController = require("../../controllers/events");
const AuthController = require("../../controllers/auth");
const DEFAULT_EVENT_LIMIT = 10;

router.get("/all-events", async (request, response) => {
  try {
    const events = await EventController.getAllEvents();
    response.send(events);
  } catch (error) {
    response.send({
      success: false,
      message: error.message,
    });
  }
});

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
        throw new Error("Query limit parameter must be a number");
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
        response.send({
          events: events,
          cursor: {
            previous_page: `http://localhost:5050/api/events/pages/${prevCursor}?limit=${eventLimit}`,
            next_page: `http://localhost:5050/api/events/pages/${nextCursor}?limit=${eventLimit}`,
          },
        });
      } else {
        // first request made to this route, determine total number of pages
        // null previous cursor on first page
        const totalPages = await EventController.getPages(eventLimit);

        response.send({
          events: events,
          total_pages: totalPages,
          cursor: {
            previous_page: null,
            next_page: `http://localhost:5050/api/events/pages/${nextCursor}?limit=${eventLimit}`,
          },
        });
      }
    } catch (error) {
      response.status(403).send({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get(
  "/:eventId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      console.log("@user", request.user);
      const { eventId } = request.params;
      const event = await EventController.getEvent(eventId);
      response.send(event);
    } catch (error) {
      response.status(403).send({
        message: error.message,
        success: false,
      });
    }
  }
);

module.exports = router;
