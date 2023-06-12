const express = require("express");
const router = express.Router();

const UserController = require("../../controllers/users");
const AuthController = require("../../controllers/auth");

router.get('/', async (request, response) => {
  try {
    const users = await UserController.getAllUsers();
    response.send({
      status: "success",
      data: {
        users,
      },
    });
  } catch(error) {
    response.send({
      status: "error",
      message: error.message,
    });
  }
});

router.get('/:userId', AuthController.authenticate, async (request, response) => {
  try {
    console.log("@user", request.user);
    const { userId } = request.params;
    const user = await UserController.getUser(userId);
    response.send({
      data: {
        user: user,
      },
    });
  } catch(error) {
    response.status(403).send({
      status: "success",
      message: error.message,
    });
  }
});

module.exports = router;