// const postgres = require("../utils/postgres");
import prisma from "../utils/prisma";
import { Event } from ".prisma/client/index";

async function getAllEvents(): Promise<Event[]> {
  return prisma.event.findMany();
}

async function getEvents(limit: number, action: string, eventId: string): Promise<Event[]> {
  let events: Event[];

  switch (action) {
    case "prev":
      events = await prisma.event.findMany({
        take: -1 * limit,
        skip: 1, // skip cursor (TODO: check if skip 1 is needed for previous page queries)
        cursor: {
          eventId: eventId,
        },
        orderBy: {
          eventId: "asc",
        },
      });
      break;
    case "next":
      events = await prisma.event.findMany({
        take: limit,
        skip: 1, // skip cursor
        cursor: {
          eventId: eventId,
        },
        orderBy: {
          eventId: "asc",
        },
      });
      break;
    // first request made for first page, no action in cursor present
    default:
      events = await prisma.event.findMany({
        take: limit,
        orderBy: {
          eventId: "asc",
        },
      });
      break;
  }

  return events;
}

async function getPages(limit: number): Promise<number> {
  const totalEvents = await prisma.event.count();
  const totalPages = Math.ceil(totalEvents / limit);
  return totalPages;
}

async function getEvent(eventId: string): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: {
      eventId: eventId,
    },
  });
  return event;
}

module.exports = {
  getEvent,
  getEvents,
  getPages,
  getAllEvents,
};
