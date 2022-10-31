const postgres = require("../utils/postgres");

async function getAllEvents() {
  const query = await postgres.query('SELECT * FROM event');
  return query.rows;
}

async function getEvent(eventId) {
  const query = await postgres.query(`SELECT * FROM event WHERE event_id='${eventId}'`);
  return query.rows[0];
}

module.exports = {
  getEvent,
  getAllEvents,
}