const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

// Get all guilds from databs
router.get(
  "/", 
  AuthController.authenticate, 
  async (request, response) => {
    try {
      const guilds = await GuildController.getAllGuilds();
      response.status(200).json({
        status: "success",
        data: {
          guilds,
        },
      });
    } 
    catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Get guild by ID
router.get(
  "/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try { 
      const guild = await GuildController.getGuild(request.params.guildId);
      if (guild) {
        response.status(200).json({
          status: "success",
          data: {
            guild,
          },
        });
      }
      else {
        response.status(400).json({
          status: "fail",
          message: "Guild does not exist."
        })  
      }
    } 
    catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Create Guild
router.post(
  "/create",
  AuthController.authenticate,
  async (request, response) => {
    try {
      // To Do: Implement Logic For Fields
      const createdGuild = await GuildController.createGuild(request.body);

      if (createdGuild) {
        response.status(200).json({
          status: "success",
          message: `Guild created successfully.`,
          data: {
            guild: createdGuild,
          },
        });
      } 
      else {
        response.status(400).json({
          status: "fail",
          message: "Could create requested guild.",
          data: {
          },
        });
      }
    } 
    catch (error) {
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
            guildId: "Guild ID not provided."
          },
        });
      }

      const updatedGuild = await GuildController.updateGuild(
        guildId,
        request.body
      );

      // To Do: Implement Checks For
      // name,handler, description, category, location, website, tags, banner, icon, media, isinviteonly
      // check if boolean, check if website www or http, check if string, check if a list of strings, check if media is actually media

      if (updatedGuild === null) {
        response.status(400).json({
          status: "fail",
          message: "Could not find or update requested guild."
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
    } 
    catch (error) {
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
