const express = require("express");
const router = express.Router();

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

router.get("/", AuthController.authenticate, async (request, response) => {
  const search = request.query.search;

  if (!search) {
    response.status(400).json({
      status: "fail",
      data: {
        search: "Missing search parameter.",
      },
    });
    return;
  }

  let guilds;
  try {
    if (search.startsWith("@")) {
      guilds = await GuildController.searchGuildByHandler(search);
    } else {
      guilds = await GuildController.searchGuildByName(search);
    }
    if (guilds.length === 0) {
      response.status(404).json({
        status: "fail",
        data: {
          search: `A guild was not found with the query ${search}`,
        },
      });
    } else {
      response.status(200).json({
        status: "success",
        data: {
          guilds,
        },
      });
    }
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

module.exports = router;
