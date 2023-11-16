const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

router.use(bodyParser.json());

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
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.get(
  "/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      if (guildId === undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            guildId: "Guild ID not provided",
          },
        });
      }

      const guild = await GuildController.getGuild(guildId);
      response.status(200).json({
        status: "success",
        data: {
          guild,
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

// To Do: Finish Create Guild Implementation
router.post(
  "/create/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      // To Do: Implement Logic For Fields
      const eventdata = {};

      eventdata;

      const guild = await GuildController.createGuild(guildId);
      response.status(200).json({
        status: "success",
        data: {
          guild,
        },
      });

      // Error Handling
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// To Do: Implement Update
router.put(
  "/update/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      let eventdata = {
        name: request.body.name,
        handler: request.body.handler,
        description: request.body.description,
        category: request.body.category,
        location: request.body.location,
        website: request.body.website,
        tags: request.body.tags,
        banner: request.body.banner,
        icon: request.body.icon,
        media: request.body.media,
        isInviteOnly: request.body.isInviteOnly,
      };

      const updated_guild = await GuildController.updateGuild(
        guildId,
        eventdata
      );

      // To Do: Implement Checks For
      // name,handler, description, category, location, website, tags, banner, icon, media, isinviteonly
      // check if boolean, check if website www or http, check if string, check if a list of strings, check if media is actually media

      if (updated_guild === null) {
        response.status(400).json({
          status: "fail",
          data: {
            message: "Could not find or update requested guild.",
          },
        });
      } else {
        response.status(200).json({
          status: "success",
          data: {
            updated_guild,
            message: `Guild updated successfully.`,
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

router.delete(
  "/delete/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      // Check if Valid Guild ID Provided
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
