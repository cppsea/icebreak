const { Client: PostgresClient } = require("pg");

const postgres = new PostgresClient({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

postgres.connect();

module.exports = postgres;
