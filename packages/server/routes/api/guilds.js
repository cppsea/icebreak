const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

// Get all guilds from database (Note: This route is just for testing, not meant to be used.)
router.get("/", AuthController.authenticate, async (request, response) => {
  try {
    response.status(200).json({
      status: "success",
      data: {
        guilds: await GuildController.getAllGuilds(),
      },
    });
  } catch (error) {
    // Should never error.
    // In the case that there are no guilds,
    // the return would be an empty array.
    // Here for redudancy.
    response.status(400).json({
      status: "error",
      errorName: error.name,
      errorMessage: error.message,
    });
  }
});

// Get guild by ID
router.get(
  "/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      return response.status(200).json({
        status: "success",
        data: {
          guild: await GuildController.getGuild(request.params.guildId),
        },
      });
    } catch (error) {
      if (error.name === "PrismaClientKnownRequestError") {
        switch (error.code) {
          case "P2023":
            return response.status(400).json({
              status: "fail",
              data: {
                guildId: "Provided guild ID is not a UUID.",
              },
            });

          case "P2025":
            return response.status(404).json({
              status: "fail",
              data: {
                guildId: `No guild with an ID of ${request.params.guildId} could be found.`,
              },
            });
        }
      } else {
        return response.status(500).json({
          status: "fail",
          message: error.message,
          errorName: error.name,
          errorcode: error.code,
        });
      }
    }
  }
);

// Create Guild
router.post("/", AuthController.authenticate, async (request, response) => {
  try {
    return response.status(200).json({
      status: "success",
      data: {
        createdGuild: await GuildController.createGuild(request.body),
      },
    });
  } catch (error) {
    // This will say that the cause of the error is in controllers/guilds.js
    // However, the real cause is that the request was missing required fields.
    return response.status(400).json({
      status: "error",
      errorName: error.name,
      message: error.message,
    });
  }
});

// Update guild by ID
router.put(
  "/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;
      const guildData = request.body;

      return response.status(200).json({
        status: "success",
        data: {
          updatedGuild: await GuildController.updateGuild(guildId, guildData),
        },
      });
    } catch (error) {
      switch (error.name) {
        case "PrismaClientKnownRequestError":
          return response.status(400).json({
            status: "error",
            errorName: error.name,
            message:
              "The provided guildId could not be matched with an existing guild.",
          });

        // There is only one known error cases.
        // This default acts as a redundant check if an unknown error occurs.
        default:
          return response.status(500).json({
            status: "fail",
            errorName: error.name,
            message: error.message,
          });
      }
    }
  }
);

// Delete guild by ID
router.delete(
  "/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;
      return response.status(200).json({
        status: "success",
        data: {
          deletedGuild: await GuildController.deleteGuild(guildId),
        },
      });
    } catch (error) {
      switch (error.name) {
        case "PrismaClientKnownRequestError":
          return response.status(400).json({
            status: "error",
            errorName: error.name,
            message:
              "The provided guildId could not be matched with an existing guild.",
          });

        // There is only one known error cases.
        // This default acts as a redundant check if an unknown error occurs.
        default:
          return response.status(500).json({
            status: "fail",
            errorName: error.name,
            message: error.message,
          });
      }
    }
  }
);

module.exports = router;
