import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";
import { ENDPOINT } from "./constants";
import PropTypes from "prop-types";

const GuildContext = createContext();

export function GuildProvider({
  // defaults to SEA guild for now
  guildId = "5f270196-ee82-4477-8277-8d4df5fcc864",
  children,
}) {
  const [guild, setGuild] = useState({});
  const [guildMembers, setGuildMembers] = useState([]);

  useEffect(() => {
    async function fetchGuildData() {
      try {
        const accessToken = await SecureStore.getValueFor("accessToken");

        const { data: guildResponse } = await axios.get(
          `${ENDPOINT}/guilds/${guildId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );
        const { data: guildMembersResponse } = await axios.get(
          `${ENDPOINT}/guilds/${guildId}/members`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );
        const { data: guildAvatarResponse } = await axios.get(
          `${ENDPOINT}/media/images/guild_avatar/${guildId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );
        const { data: guildBannerResponse } = await axios.get(
          `${ENDPOINT}/media/images/guild_banner/${guildId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );

        const guild = guildResponse.data.guild;
        guild.avatar = guildAvatarResponse.data.imageURL.avatar;
        guild.banner = guildBannerResponse.data.imageURL.banner;

        setGuild(guildResponse.data.guild);
        setGuildMembers(guildMembersResponse.data.guildMembers);
      } catch (err) {
        console.error(err);
      }
    }

    fetchGuildData();
  }, []);

  const ctxValue = useMemo(() => ({
    guild,
    setGuild,
    guildMembers,
    setGuildMembers,
  }));

  return (
    <GuildContext.Provider value={ctxValue}>{children}</GuildContext.Provider>
  );
}

GuildProvider.propTypes = {
  guildId: PropTypes.string,
  children: PropTypes.node,
};

export function useGuildContext() {
  const guildCtxValue = useContext(GuildContext);
  if (!guildCtxValue) {
    throw new Error(
      "You are using guild context outside of GuildProvider. Context undefined",
    );
  }

  return guildCtxValue;
}
