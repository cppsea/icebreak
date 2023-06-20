const server = require("../index");
const { closePostgres } = require("../utils/postgres");

/**
 * utility function to clean up and close database connection and express
 * server after testing
 */
function cleanUpConnections() {
  closePostgres();
  server.close();
}

module.exports = cleanUpConnections;
