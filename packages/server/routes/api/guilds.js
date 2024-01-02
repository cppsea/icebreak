const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

// Get all guilds from database (Note: This route is just for testing purposes, not meant to be used.)
router.get("/", AuthController.authenticate, async (request, response) => {
  try {
    response.status(200).json({
      status: "success",
      data: {
        guilds: await GuildController.getAllGuilds(),
      },
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get guild by ID
router.get(
  "/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const guildId = request.params.guildId;
      const guild = await GuildController.getGuild(guildId);

      return response.status(200).json({
        status: "success",
        data: {
          guild,
        },
      });
    } catch (error) {
      if (error.name === "PrismaClientKnownRequestError") {
        switch (error.code) {
          case "P2023":
            return response.status(400).json({
              status: "fail",
              data: {
                guildId: "Provided guild ID is not a valid UUID.",
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
      }
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
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
    if (error.name === "PrismaClientValidationError") {
      return response.status(400).json({
        status: "fail",
        data: {
          guildId:
            "Guild could not be created because of missing or invalid arguments, see last line of error message below for details.",
          message: error.message,
        },
      });
    }

    return response.status(500).json({
      status: "error",
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
      if (error.name === "PrismaClientKnownRequestError") {
        switch (error.code) {
          case "P2023":
            return response.status(400).json({
              status: "fail",
              data: {
                guildId: "Provided guild ID is not a valid UUID.",
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
      } else if (error.name === "PrismaClientValidationError") {
        return response.status(400).json({
          status: "fail",
          data: {
            guildId:
              "Guild could not be updated because of missing or invalid arguments, see last line of error message below for details.",
            message: error.message,
          },
        });
      }
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
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
      if (error.name === "PrismaClientKnownRequestError") {
        switch (error.code) {
          case "P2023":
            return response.status(400).json({
              status: "fail",
              data: {
                guildId: "Provided guild ID is not a valid UUID.",
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
      }
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

module.exports = router;
