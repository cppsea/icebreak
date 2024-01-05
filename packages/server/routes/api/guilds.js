const express = require("express");
const router = express.Router();
const { validate: uuidValidate } = require("uuid");

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");
const {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");

// Get all guilds from database (Note: This route is just for testing purposes, not meant to be used.)
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
      if (error instanceof PrismaClientKnownRequestError) {
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
    if (error instanceof PrismaClientValidationError) {
      return response.status(400).json({
        status: "fail",
        data: {
          guildId:
            "Guild could not be created because of missing or invalid arguments.",
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
      if (error instanceof PrismaClientKnownRequestError) {
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
      } else if (error instanceof PrismaClientValidationError) {
        return response.status(400).json({
          status: "fail",
          data: {
            guildId: "Guild could not be updated because of invalid arguments.",
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
      if (error instanceof PrismaClientKnownRequestError) {
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

router.get(
  "/:guildId/members",
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

      if (!uuidValidate(guildId)) {
        return response.status(400).json({
          status: "fail",
          data: {
            guildId: "Invalid Guild ID format",
          },
        });
      }

      if (!(await GuildController.guildExists(guildId))) {
        return response.status(404).json({
          status: "fail",
          data: {
            guildId: `Guild not found with an ID of ${guildId}`,
          },
        });
      }

      const guildMembers = await GuildController.getGuildMembers(guildId);
      response.status(200).json({
        status: "success",
        data: {
          guildMembers,
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
