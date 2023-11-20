const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

// Get all guilds from database
router.get("/", AuthController.authenticate, async (request, response) => {
  try {
    response.status(200).json({
      status: "success",
      data: await GuildController.getAllGuilds(),
    });
  } catch (error) {
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
        data: await GuildController.getGuild(request.params.guildId),
      });
      
    } catch (error) {

      switch (error.name) {

        case "PrismaClientKnownRequestError":
          return response.status(400).json({
            status: "error",
            errorName: error.name,
            errorMessage: error.message,
          });
          
        case "NotFoundError":
          return response.status(500).json({
            status: "fail",
            errorName: error.name,
            errorMessage: error.message,
          });
        
        // There are only two known error cases.
        // This default acts as a redundant check if an unknown error occurs.
        default:
          return response.status(500).json({
            status: "fail",
            errorName: error.name,
            errorMessage: error.message,
          });
      }
    }
  }
);

// Create Guild
router.post(
  "/create",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const createdGuild = await GuildController.createGuild(request.body);

      if (createdGuild) {
        response.status(200).json({
          status: "success",
          message: "Guild created successfully.",
          data: {
            guild: createdGuild,
          },
        });
      } else {
        response.status(400).json({
          status: "fail",
          message: "Could create requested guild.",
          data: {},
        });
      }
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Update guild by ID
router.put(
  "/update/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      if (guildId === ":guildId") {
        return response.status(400).json({
          status: "fail",
          data: {
            guildId: "Guild ID not provided.",
          },
        });
      }

      const updatedGuild = await GuildController.updateGuild(
        guildId,
        request.body
      );

      if (updatedGuild === null) {
        response.status(400).json({
          status: "fail",
          message: "Could not find or update requested guild.",
        });
      } else {
        response.status(200).json({
          status: "success",
          message: "Guild updated successfully.",
          data: {
            updatedGuild: updatedGuild,
          },
        });
      }
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Delete guild by ID
router.delete(
  "/delete/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      if (guildId === ":guildId") {
        return response.status(400).json({
          status: "fail",
          data: {
            guildId: "Guild ID not provided.",
          },
        });
      }

      const deleted_guild = await GuildController.deleteGuild(guildId);

      if (deleted_guild === null) {
        response.status(400).json({
          status: "fail",
          data: {
            message: "Could not find or delete requested guild.",
          },
        });
      } else {
        response.status(200).json({
          status: "success",
          data: {
            guildId: "Guild deleted successfully.",
          },
        });
      }
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

module.exports = router;
