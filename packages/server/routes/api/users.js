const express = require("express");
const router = express.Router();

const UserController = require("../../controllers/users");

router.get('/', async (request, response) => {
  const users = await UserController.getAllUsers();
  console.log(request.isAuthenticated());
  response.send(users);
});

router.get('/:userId', async (request, response) => {
  const { userId } = request.params;
  const user = await UserController.getUser(userId);
  response.send(user[0]);
});

router.post('/test', async (request, response) => {
  console.log(request.user)
  response.send({
    message: "hiii"
  });
})

module.exports = router;