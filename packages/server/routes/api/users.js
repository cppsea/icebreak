const express = require("express");
const router = express.Router();

const UserController = require("../../controllers/users");
const AuthController = require("../../controllers/auth");
const GuildController = require("../../controllers/guilds");

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
  async (request, response) => {
    try {
      const { userId } = request.params;

      // Check if the user exists
      const user = await UserController.getUser(userId);

      if (!user) {
        return response.status(404).json({
          status: "fail",
          data: {
            userId: `User not found with ID ${userId}`,
          },
        });
      }

      // Fetch all guilds for the user
      const userGuilds = await GuildController.getGuildsForUser(userId);

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
