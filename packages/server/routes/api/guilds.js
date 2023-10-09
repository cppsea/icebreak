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

router.post(
  "/insert",
  AuthController.authenticate,
  async (request, response) => {
    try {
      const newGuild = await GuildController.insertGuild(request.body);
      response.json({
        status: "success",
        data: {
          newGuild: newGuild,
        },
      });
    } catch (error) {
      response.status(403).send({
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

module.exports = router;