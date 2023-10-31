const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

router.get("/", AuthController.authenticate, async (request, response) => {
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
});

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
  "/guild/create/:guildId",
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
router.put();

// To Do: Finalize Delete Implementation
router.delete(
  "/guild/delete/:guildId",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const { guildId } = request.params;

      if (guildId === undefined) {
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
            message: "Could not delete requested guild.",
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
