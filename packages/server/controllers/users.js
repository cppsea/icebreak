const postgres = require("../utils/postgres");

async function getAllUsers() {
  const query = await postgres.query('SELECT * FROM users');
  return query.rows;
}

async function getUser(userId) {
  const query = await postgres.query(`SELECT * FROM users WHERE user_id='${userId}'`);
  return query.rows[0];
}

module.exports = {
  getUser,
  getAllUsers,
}