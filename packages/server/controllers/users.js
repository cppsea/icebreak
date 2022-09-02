const express = require("express");
const router = express.Router();

const postgres = require("../utils/postgres");

router.get('/', async (request, response) => {
  const query = await postgres.query('SELECT * FROM users');
  response.send(query.rows)
});

router.get('/:userId', async (request, response) => {
  const { userId } = request.params;
  console.log(userId);
  const query = await postgres.query(`SELECT * FROM users WHERE user_id='${userId}'`);
  response.send(query.rows);
});

module.exports = router;