const { postgres } = require("../utils/postgres");

async function getAllEvents() {
  const query = await postgres.query(
    "SELECT * FROM events ORDER BY event_id ASC"
  );
  return query.rows;
}

async function getEvents(limit, action, eventId) {
  let query;

  switch (action) {
    case "prev":
      // SQL query to get events in descending order from the eventId to get
      // previous page's worth of events and then sort it in ascending order
      // for better visibility
      query = await postgres.query(
        `WITH prev_events AS (
          SELECT * FROM events WHERE event_id < '${eventId}' ORDER BY event_id
          DESC LIMIT ${limit})
        SELECT * FROM prev_events ORDER BY event_id ASC`
      );
      break;
    case "next":
      query = await postgres.query(
        `SELECT * FROM events WHERE event_id > '${eventId}' ORDER BY event_id
        ASC LIMIT ${limit}`
      );
      break;
    // first request made for first page, no action in cursor present
    case undefined:
    default:
      query = await postgres.query(
        `SELECT * FROM events ORDER BY event_id ASC LIMIT ${limit}`
      );
      break;
  }

  return query.rows;
}

async function getPages(limit) {
  const query = await postgres.query("SELECT COUNT(*) FROM events");
  let { count: totalEvents } = query.rows[0];
  const totalPages = Math.ceil(parseInt(totalEvents) / limit);
  return totalPages;
}

async function getEvent(eventId) {
  const query = await postgres.query(
    `SELECT *
    FROM event
    WHERE event_id='${eventId}'`
  );
  return query.rows[0];
}

module.exports = {
  getEvent,
  getEvents,
  getPages,
  getAllEvents,
};
