const express = require("express");
const router = express.Router();

const UserController = require("../../controllers/users");
const AuthController = require("../../controllers/auth");

router.get('/', async (request, response) => {
  const users = await UserController.getAllUsers();
  response.send(users);
});

router.get('/:userId', AuthController.authenticate, async (request, response) => {
  try {
    console.log("@user", request.user);
    const { userId } = request.params;
    const user = await UserController.getUser(userId);
    response.send(user);
  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});

module.exports = router;