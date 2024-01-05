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

const GuildContext = createContext();

// eslint-disable-next-line react/prop-types
export function GuildProvider({ children }) {
  const [guild, setGuild] = useState({});
  const [guildMembers, setGuildMembers] = useState([]);

  useEffect(() => {
    async function fetchGuildData() {
      try {
        const accessToken = await SecureStore.getValueFor("accessToken");

        const { data: guildResponse } = await axios.get(
          `${ENDPOINT}/guilds/5f270196-ee82-4477-8277-8d4df5fcc864`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        const { data: guildMembersResponse } = await axios.get(
          `${ENDPOINT}/guilds/5f270196-ee82-4477-8277-8d4df5fcc864/members`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
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

export function useGuildContext() {
  const guildCtxValue = useContext(GuildContext);
  if (!guildCtxValue) {
    throw new Error(
      "You are using guild context outside of GuildProvider. Context undefined"
    );
  }

  return guildCtxValue;
}
