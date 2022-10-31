const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guild");
const AuthController = require("../../controllers/auth");

router.get('/', async (request, response) => {
  try {
    const guilds = await GuildController.getAllGuild();
    response.send(guilds);
  } catch(error) {
    response.send({
      success: false,
      message: error.message
    });
  }
});

router.get('/:guildId', AuthController.authenticate, async (request, response) => {
  try {
    console.log("@user", request.user);
    const { guildId } = request.params;
    const guild = await GuildController.getEvent(guildId);
    response.send(guild);
  } catch(error) {
    response.status(403).send({
      message: error.message,
      success: false
    });
  }
});

module.exports = router;