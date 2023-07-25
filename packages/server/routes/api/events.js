const express = require("express");
const router = express.Router();

const EventController = require("../../controllers/events");
const AuthController = require("../../controllers/auth");
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
      const [currentPage, action, eventId] = requestCursor.split("___");
      const events = await EventController.getEvents(
        eventLimit,
        action,
        eventId
      );

      if (events.length === 0) {
        throw new Error("Tried to access nonexistent page");
      }

      // generate cursors for previous and next pages
      const firstEventId = events[0].event_id;
      const lastEventId = events[events.length - 1].event_id;
      const prevCursor = Buffer.from(
        `${currentPage - 1}___prev___${firstEventId}`
      ).toString("base64");
      const nextCursor = Buffer.from(
        `${currentPage + 1}___next___${lastEventId}`
      ).toString("base64");

      // follow-up request, not first request to api route
      if (currentPage && action && eventId) {
        response.send({
          status: "success",
          data: {
            events: events,
            cursor: {
              previous_page: `http://localhost:5050/api/events/${prevCursor}?limit=${eventLimit}`,
              next_page: `http://localhost:5050/api/events/${nextCursor}?limit=${eventLimit}`,
            },
          },
        });
      } else {
        // first request made to this route, determine total number of pages
        // null previous cursor on first page
        const totalPages = await EventController.getPages(eventLimit);

        response.send({
          status: "success",
          data: {
            events: events,
            total_pages: totalPages,
            cursor: {
              previous_page: null,
              next_page: `http://localhost:5050/api/events/${nextCursor}?limit=${eventLimit}`,
            },
          },
        });
      }
    } catch (error) {
      response.status(403).send({
        status: "error",
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
      const { eventId } = request.params;
      const event = await EventController.getEvent(eventId);
      response.send({
        status: "success",
        data: {
          event: event,
        },
      });
    } catch (error) {
      response.status(403).send({
        status: "error",
        message: error.message,
      });
    }
  }
);

module.exports = router;
