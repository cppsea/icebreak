const express = require("express");
const router = express.Router();
const { validationResult, matchedData } = require("express-validator");
const { userIdValidator } = require("../../validators/users");

const UserController = require("../../controllers/users");
const AuthController = require("../../controllers/auth");

router.get("/", async (request, response) => {
  try {
    const users = await UserController.getAllUsers();
    response.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get(
  "/:userId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { userId } = request.params;

      if (userId === undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            userId: "User ID not provided",
          },
        });
      }

      const user = await UserController.getUser(userId);
      response.status(200).json({
        status: "success",
        data: {
          user: user,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Get all guilds for a specific user
router.get(
  "/:userId/guilds",
  AuthController.authenticate,
  userIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const userId = data.userId;

    try {
      // Fetch all guilds for the user
      const userGuilds = await UserController.getGuildsForUser(userId);

      response.status(200).json({
        status: "success",
        data: {
          userGuilds,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.put(
  //Route handler to update user
  "/:userId",
  AuthController.authenticate,
  userIdValidator,
  // updateUserValidator,
  async (request, response) => {
    // access validation results
    const result = validationResult(request);

    // if validation result is not empty, errors occurred
    if (!result.isEmpty()) {
      response.status(400).json({
        status: "fail",
        data: result.array(),
      });
      return;
    }

    try {
      const validatedData = matchedData(request);
      const userId = validatedData.userId;

      const updatedEvent = await UserController.updateEvent(
        userId,
        validatedData
      );

      response.status(200).json({
        status: "success",
        data: {
          event: updatedEvent,
        },
      });
    } catch (error) {
      //Any error that happens in the update controller will be caught and handled here
      //For now just respond with the error message
      response.status(500).json({
        status: "error",
        message: error.message,
      });
      return;
    }
  }
);

module.exports = router;
