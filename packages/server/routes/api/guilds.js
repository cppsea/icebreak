const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

router.get("/", async (request, response) => {
  try {
    const guilds = await GuildController.getAllGuilds();
    response.send({
      status: "success",
      data: {
        guilds,
      },
    });
  } catch (error) {
    response.send({
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
      response.send({
        status: "success",
        data: {
          guild,
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

module.exports = router;
