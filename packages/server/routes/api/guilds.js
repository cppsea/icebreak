const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

// Get all guilds from database
router.get("/", AuthController.authenticate, async (request, response) => {
  try {
    response.status(200).json({
      status: "success",
      data: {
        guilds: await GuildController.getAllGuilds(),
      }
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
        }
      });
      
    } catch (error) {

      switch (error.name) {

        case "PrismaClientKnownRequestError":
          return response.status(400).json({
            status: "error",
            errorName: error.name,
            errorMessage: "The guildId Provided had invalid format.",
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
  "/",
  AuthController.authenticate,
  async (request, response) => {
    try {
      return response.status(200).json({
        status: "success",
        data:{
          createdGuild: await GuildController.createGuild(request.body),
        }
      });
    } catch (error) {
      // This will say that the cause of the error is in controllers/guilds.js
      // However, the real cause is that the request was missing required fields.
      return response.status(400).json({
        status: "error",
        errorName: error.name,
        errorMessage: error.message,
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
