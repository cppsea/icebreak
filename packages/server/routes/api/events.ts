import express from "express";
const router = express.Router();
const DEFAULT_EVENT_LIMIT: number = 10;

import EventController from "../../controllers/events";
import AuthController from "../../controllers/auth";
import { APIRequest, APIResponse } from "../../types/index"
import { Event } from "@prisma/client";

type APIRequestCursor = {
  cursor: string,
}

type APIResponseCursor = {
  events: Event[],
  totalPages?: number,
  cursor: {
    previousPage: string | null,
    nextPage: string | null,
  }
}

/**
 * cursor is base-64 encoded and formatted as
 * current page___(prev or next)___event_id reference,
 * for example, 1___next___384629bffb28f2
 * (3 underscores separator)
 */
router.get(
  "/pages/:cursor?",
  AuthController.authenticate,
  async (request: APIRequest<APIRequestCursor,void>, response: APIResponse<APIResponseCursor>) => {
    try {
      let queryLimit: string = request.query.limit as string

      if (queryLimit && isNaN(parseInt(queryLimit))) {
        return response.status(400).json({
          status: "fail",
          data: {
            limit: "Total event limit for a page must be a number",
          },
        });
      }

      const eventLimit: number = parseInt(queryLimit) || DEFAULT_EVENT_LIMIT;
      // base64 decode cursor parameter if not null
      const requestCursor: string = request.params.cursor
        ? Buffer.from(request.params.cursor, "base64").toString()
        : "";

      // let [currentPage, action, eventId] = requestCursor.split("___");
      let cursor: string[] = requestCursor.split("___");
      let currentPage: number = parseInt(cursor[0]) || 1;
      let action: string = cursor[1]
      let eventId: string = cursor[2]

      const events: Event[] = await EventController.getEvents(
        eventLimit,
        action,
        eventId,
      );

      if (events.length === 0) {
        throw new Error("Tried to access nonexistent page");
      }

      // generate cursors for previous and next pages
      // const firstEventId = events[0].event_id;
      // const lastEventId = events[events.length - 1].event_id;
      const firstEventId: string = events[0].eventId;
      const lastEventId: string = events[events.length - 1].eventId;
      const prevCursor: string = Buffer.from(
        `${currentPage - 1}___prev___${firstEventId}`
      ).toString("base64");
      const nextCursor: string = Buffer.from(
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
        const totalPages: number = await EventController.getPages(eventLimit);

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
      if(error instanceof Error) {
        response.status(500).json({
        status: "error",
        message: error.message,
        })
      }
      else {
        response.status(500).json({
        status: "error",
        message: "An unknown error has occured",
        });
      }
    }
  }
);

type APIRequestGetEvent = {
  eventId: string,
}

type APIResponseGetEvent = {
  event: Event | null,
}

router.get(
  "/:eventId",
  AuthController.authenticate,
  async (request: APIRequest<APIRequestGetEvent,void>, response:APIResponse<APIResponseGetEvent>) => {
    try {
      const { eventId } = request.params;
      const event: Event | null = await EventController.getEvent(eventId);
      response.status(200).json({
        status: "success",
        data: {
          event: event,
        },
      });
    } catch (error) {
      if(error instanceof Error) {
        response.status(500).json({
        status: "error",
        message: error.message,
        })
      }
      else {
        response.status(500).json({
        status: "error",
        message: "An unknown error has occured",
        });
      }
    }
  }
);

export default router;
