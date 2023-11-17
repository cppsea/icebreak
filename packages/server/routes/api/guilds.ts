import express from "express";
const router = express.Router();

import GuildController from "../../controllers/guilds";
import AuthController from "../../controllers/auth";
import { APIRequest, APIResponse } from "../../types/index"
import { Guild } from "@prisma/client";

type APIResponseAllGuilds = {
  guilds: Guild[],
}

router.get("/", AuthController.authenticate, 
async (request: APIRequest<object,void>, response: APIResponse<APIResponseAllGuilds>) => {
  try {
    const guilds: Guild[] = await GuildController.getAllGuilds();
    response.status(200).json({
      status: "success",
      data: {
        guilds: guilds,
      },
    });
  } catch (error) {
      if(error instanceof Error) {
        response.status(500).json({
        status: "error",
        message: error.message,
        })
      }
      else {
        response.status(500).json({
        status: "error",
        message: "An unknown error has occured",
        });
      }
    }
});

type APIResponseGetGuild = {
  guild: Guild | null,
}

type APIRequestGetGuild = {
  guildId: string,
}

router.get(
  "/:guildId",
  AuthController.authenticate,
  async (request: APIRequest<APIRequestGetGuild,void>, response: APIResponse<APIResponseGetGuild>) => {
    try {
      const { guildId } = request.params;
      
      if (guildId === undefined) {
        return response.status(400).json({
          status: "fail",
          data: {
            guild: "Guild ID not provided",
          },
        });
      }

      const guild = await GuildController.getGuild(guildId);
      response.status(200).json({
        status: "success",
        data: {
          guild: guild,
        },
      });
    } catch (error) {
      if(error instanceof Error) {
        response.status(500).json({
        status: "error",
        message: error.message,
        })
      }
      else {
        response.status(500).json({
        status: "error",
        message: "An unknown error has occured",
        });
      }
    }
  });

export default router;
