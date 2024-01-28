const express = require("express");
const router = express.Router();
const { validationResult, matchedData, param } = require("express-validator");

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
  [
    param("userId")
      .notEmpty()
      .withMessage("User ID cannot be empty")
      .isUUID()
      .withMessage("Invalid user ID provided")
      .custom(async (value) => {
        const user = await UserController.getUser(value);
        if (!user) {
          throw new Error("User with ID ${value} not found");
        }
        return true;
      }),
  ],
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: {
          errors: result.array(),
        },
      });
    }

    try {
      const { userId } = matchedData(request);

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

module.exports = router;
