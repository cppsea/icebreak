const express = require("express");
const router = express.Router();
const { validationResult, matchedData } = require("express-validator");
const {
  userIdValidator,
  onboardingValidator,
} = require("../../validators/users");

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
  },
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
  },
);

router.post(
  "/:userId/onboarding",
  AuthController.authenticate,
  onboardingValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }
    const validatedData = matchedData(request);
    const { userId } = matchedData(request);

    try {
      const updatedNewUser = await UserController.updateNewUser(
        userId,
        validatedData,
      );
      response.status(200).json({
        status: "success",
        data: {
          updatedNewUser,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

module.exports = router;
