const postgres = require("../utils/postgres");

const userSchema = new postgres.Schema({ // user details when signing up for the first time
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

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