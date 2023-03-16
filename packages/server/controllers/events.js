// const postgres = require("../utils/postgres");
const prisma = require("../utils/prisma");

async function getAllEvents() {
  const query = await postgres.query(
    "SELECT * FROM event ORDER BY event_id ASC"
  );
  return query.rows;
}

async function getEvents(limit, action, eventId) {
  // let query;
  let events;

  switch (action) {
    case "prev":
      // SQL query to get events in descending order from the eventId to get
      // previous page's worth of events and then sort it in ascending order
      // for better visibility
      // query = await postgres.query(
      //   `WITH prev_events AS (
      //     SELECT * FROM event WHERE event_id < '${eventId}' ORDER BY event_id
      //     DESC LIMIT ${limit})
      //   SELECT * FROM prev_events ORDER BY event_id ASC`
      // );

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
      // query = await postgres.query(
      //   `SELECT * FROM event WHERE event_id > '${eventId}' ORDER BY event_id
      //   ASC LIMIT ${limit}`
      // );

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
      // query = await postgres.query(
      //   `SELECT * FROM event ORDER BY event_id ASC LIMIT ${limit}`
      // );

      events = await prisma.event.findMany({
        take: limit,
        orderBy: {
          eventId: "asc",
        },
      });
      break;
  }

  // return query.rows;
  return events;
}

async function getPages(limit) {
  // const query = await postgres.query("SELECT COUNT(*) FROM event");
  // let { count: totalEvents } = query.rows[0];
  // const totalPages = Math.ceil(parseInt(totalEvents) / limit);
  const totalEvents = await prisma.event.count();
  const totalPages = Math.ceil(totalEvents / limit);
  return totalPages;
}

async function getEvent(eventId) {
  // const query = await postgres.query(
  //   `SELECT *
  //   FROM event
  //   WHERE event_id='${eventId}'`
  // );
  // return query.rows[0];
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
