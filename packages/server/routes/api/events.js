const express = require("express");
const router = express.Router();

const EventController = require("../../controllers/events");
const AuthController = require("../../controllers/auth");
const {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
} = require("../../validators/events");
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
  //Rotuer to create events
  "/:guildId",
  AuthController.authenticate,
  // put validator here right before route handler function is run
  createEventValidator,
  async (request, response) => {
    // access validation results
    const result = validationResult(request);

    // if validation result is not empty, errors occurred
    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array({ onlyFirstError: true }),
      });
      return;
    }

    // matchedData lets us use data.guildId, instead of having to specify req.body.guildId every time we reference it
    const data = matchedData(request);

    const guildId = data.guildId;
    const eventData = request.body;
    let givenData = {
      title: request.body.title || undefined,
      description: request.body.description || undefined,
      startDate: request.body.startDate || undefined,
      endDate: request.body.endDate || undefined,
      location: request.body.location || undefined,
      thumbnail: request.body.thumbnail || undefined,
    };
    //input validation
    if (givenData.title) {
      if (givenData.title.length > 255) {
        response.status(400).json({
          status: "fail",
          data: {
            title: "Title exceeds 255 characters",
          },
        });
      }
    }
    if (givenData.description) {
      if (givenData.description.length > 255) {
        response.status(400).json({
          status: "fail",
          data: {
            description: "Description exceeds 255 characters",
          },
        });
      }
    }
    if (givenData.location) {
      if (givenData.location.length > 255) {
        response.status(400).json({
          status: "fail",
          data: {
            location: "Location exceeds 255 characters",
          },
        });
      }
    }
    if (givenData.thumbnail) {
      if (givenData.length > 255) {
        response.status(400).json({
          status: "fail",
          data: {
            thumbnail: "Thumbnail exceeds 255 characters",
          },
        });
      } //A regex to see if the thumbnail is a valid image file
      else if (!/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/.test(givenData.thumbnail)) {
        response.status(400).json({
          status: "fail",
          data: {
            thumbnail: "Thumbnail is not a valid image file",
          },
        });
      }
    }
    if (givenData.startDate && givenData.endDate) {
      if (givenData.startDate > givenData.endDate) {
        response.status(400).json({
          status: "fail",
          data: {
            startDate: "Start date is after end date",
            endDate: "End date is before start date",
          },
        });
      }
    } else if (givenData.startDate) {
      if (
        givenData.endDate != null &&
        givenData.startDate > givenData.endDate.toISOString()
      ) {
        response.status(400).json({
          status: "fail",
          data: {
            startDate: "Start date is after end date",
          },
        });
      }
    } else if (givenData.endDate) {
      if (
        givenData.startDate != null &&
        givenData.startDate.toISOString() > givenData.endDate
      ) {
        response.status(400).json({
          status: "fail",
          data: {
            endDate: "End date is before start date",
          },
        });
      }
    }

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
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { eventId } = request.params;
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
      const { eventId } = request.params;
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
      const { eventId } = request.params;
      //See what data was given in request. Any data not given to be updated will be undefined
      let givenData = {
        title: request.body.title || undefined,
        description: request.body.description || undefined,
        startDate: request.body.startDate || undefined,
        endDate: request.body.endDate || undefined,
        location: request.body.location || undefined,
        thumbnail: request.body.thumbnail || undefined,
      };

      const updatedEvent = await EventController.updateEvent(
        eventId,
        givenData
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

module.exports = router;
