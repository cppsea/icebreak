const { Pool: PostgresClient } = require("pg");

const postgres = new PostgresClient({
  host: 'localhost',
  user: 'deric',
  database: 'icebreak',
  part: 5432
});

module.exports = postgres;
