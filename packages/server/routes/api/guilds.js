const express = require("express");
const router = express.Router();
const { validate: uuidValidate } = require("uuid");

const {
  guildIdValidator,
  createGuildValidator,
  updateGuildValidator,
  updateGuildMemberRoleValidator,
} = require("../../validators/guilds");
const { userIdValidator } = require("../../validators/users");
const { validationResult, matchedData } = require("express-validator");

const GuildController = require("../../controllers/guilds");
const AuthController = require("../../controllers/auth");

const { GuildMemberRole } = require("@prisma/client");

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

// Get guild by ID
router.get(
  "/:guildId",
  AuthController.authenticate,
  guildIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;

    try {
      const guild = await GuildController.getGuild(guildId);
      return response.status(200).json({
        status: "success",
        data: {
          guild,
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

// Create Guild
router.post(
  "/",
  AuthController.authenticate,
  createGuildValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const guildData = request.body;

    try {
      return response.status(200).json({
        status: "success",
        data: {
          createdGuild: await GuildController.createGuild(guildData),
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

// Update guild by ID
router.put(
  "/:guildId",
  AuthController.authenticate,
  guildIdValidator,
  updateGuildValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;
    const guildData = request.body;

    try {
      return response.status(200).json({
        status: "success",
        data: {
          updatedGuild: await GuildController.updateGuild(guildId, guildData),
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

// Delete guild by ID
router.delete(
  "/:guildId",
  AuthController.authenticate,
  guildIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;

    try {
      return response.status(200).json({
        status: "success",
        data: {
          deletedGuild: await GuildController.deleteGuild(guildId),
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
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

      const guildMembers = await GuildController.getAllGuildMembers(guildId);
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
  },
);

// Add guild member
router.post(
  "/:guildId/members/:userId",
  AuthController.authenticate,
  guildIdValidator,
  userIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;
    const userId = data.userId;

    try {
      const client = request.user;
      const guildData = await GuildController.getGuild(guildId);
      const clientData = await GuildController.getGuildMember(
        guildId,
        client.userId,
      );

      if (await GuildController.isGuildMember(guildId, userId)) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId: "Guild member already exists.",
          },
        });
      }

      if (
        !(await GuildController.isGuildMember(guildId, client.userId)) &&
        client.userId !== userId
      ) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId: "Access denied. Non-members cannot add other users.",
          },
        });
      }

      // If invite-only guild, fail if
      // - Non-member attempts to join the guild
      // - unauth member attempts to add another user
      if (guildData.isInviteOnly) {
        if (
          client.userId === userId ||
          clientData.role === GuildMemberRole.Member
        ) {
          return response.status(403).json({
            status: "fail",
            data: {
              userId:
                "Access denied. Only authorized members may add users to an invite-only guild.",
            },
          });
        }
      }

      return response.status(200).json({
        status: "success",
        data: {
          createdMember: await GuildController.addGuildMember(guildId, userId),
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

// Update guild member's role
router.put(
  "/:guildId/members/:userId/roles",
  AuthController.authenticate,
  guildIdValidator,
  userIdValidator,
  updateGuildMemberRoleValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;
    const userId = data.userId;
    const role = request.body.role;

    try {
      const client = request.user;
      const clientData = await GuildController.getGuildMember(
        guildId,
        client.userId,
      );

      if (!(await GuildController.isGuildMember(guildId, userId))) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId: "Guild member does not exist.",
          },
        });
      }

      if (!clientData || clientData.role !== GuildMemberRole.Owner) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId: "Access denied. Only the guild owner can edit roles.",
          },
        });
      }

      if (client.userId === userId) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId: "The guild owner cannot edit their own role.",
          },
        });
      }

      if (role === GuildMemberRole.Owner) {
        await GuildController.updateGuildMemberRole(
          guildId,
          client.userId,
          GuildMemberRole.Member,
        );
      }

      return response.status(200).json({
        status: "success",
        data: {
          updatedMember: await GuildController.updateGuildMemberRole(
            guildId,
            userId,
            role,
          ),
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

// Delete guild member
router.delete(
  "/:guildId/members/:userId",
  AuthController.authenticate,
  guildIdValidator,
  userIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;
    const userId = data.userId;

    try {
      // If member does not exist, fail
      if (!(await GuildController.isGuildMember(guildId, userId))) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId: "Guild member does not exist.",
          },
        });
      }

      // Get client and user data
      const client = request.user;
      const clientData = await GuildController.getGuildMember(
        guildId,
        client.userId,
      );
      const userData = await GuildController.getGuildMember(guildId, userId);

      // Not auth if client is member or has a lower role than the added user, fail
      if (
        !clientData ||
        clientData.role === GuildMemberRole.Member ||
        userData.role >= clientData.role
      ) {
        return response.status(403).json({
          status: "fail",
          data: {
            userId:
              "Access denied. User is not authorized to perform this function.",
          },
        });
      }

      return response.status(200).json({
        status: "success",
        data: {
          deletedMember: await GuildController.deleteGuildMember(
            guildId,
            userId,
          ),
        },
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

router.get(
  "/:guildId/leaderboard",
  AuthController.authenticate,
  guildIdValidator,
  async (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        data: result.array(),
      });
    }

    const data = matchedData(request);
    const guildId = data.guildId;

    try {
      const guildLeaderboard = await GuildController.getLeaderboard(guildId);

      response.status(200).json({
        status: "success",
        data: {
          guildLeaderboard,
        },
      });
    } catch (error) {
      response.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
);

module.exports = router;
