const { Client: PostgresClient } = require("pg");

const postgres = new PostgresClient({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

postgres.on("connection", (stream) => {
  console.log("Postgres database connection successfully established.");
});

postgres.connect();

function closePostgres() {
  postgres.end();
}

module.exports = { postgres, closePostgres };
