const express = require("express");
const router = express.Router();

const UserController = require("../../controllers/users");

router.get('/', async (request, response) => {
  const users = UserController.getAllUsers();
  response.send(users);
});

router.get('/:userId', async (request, response) => {
  const { userId } = request.params;
  const user = UserController.getUser(userId);
  response.send(user);
});

module.exports = router;