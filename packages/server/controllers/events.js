// const postgres = require("../utils/postgres");
const prisma = require("../prisma/prisma");

async function getAllEvents() {
  return prisma.event.findMany();
}

async function getEvents(limit, action, eventId) {
  let events;

  switch (action) {
    case "prev":
      events = await prisma.events.findMany({
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
      events = await prisma.events.findMany({
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
      events = await prisma.events.findMany({
        take: limit,
        orderBy: {
          eventId: "asc",
        },
      });
      break;
  }

  return events;
}

async function getPages(limit) {
  const totalEvents = await prisma.events.count();
  const totalPages = Math.ceil(totalEvents / limit);
  return totalPages;
}

async function getEvent(eventId) {
  const event = await prisma.events.findUnique({
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
