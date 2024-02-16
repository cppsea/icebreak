import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Platform } from "react-native";
import GuildCard from "./GuildCard";
import { GuildProvider } from "@app/utils/GuildContext.js";
import PropTypes from "prop-types";

import axios from "axios";
import { ENDPOINT } from "@app/utils/constants.js";
import * as SecureStore from "@app/utils/SecureStore";

const shadow = "rgba(0, 0, 0, 0.25)";
const titleColor = "rgb(51,51,51)";
const white = "#fff";

const USER_ID = "80eb49ef-ce2a-46e2-b440-911192976ac1"; // temporary userId

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  container: {
    backgroundColor: white,
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 50,
    ...Platform.select({
      ios: {
        shadowColor: shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        shadowColor: shadow,
        elevation: 20,
      },
    }),
  },
  title: {
    color: titleColor,
    fontSize: 30,
    fontWeight: "bold",
    margin: 15,
    marginBottom: 10,
  },
});

const useUserGuilds = () => {
  const [guilds, setGuilds] = useState([]);

  useEffect(() => {
    async function fetchUserGuilds() {
      try {
        const accessToken = await SecureStore.getValueFor("accessToken");

        const response = await axios.get(
          `${ENDPOINT}/users/${USER_ID}/guilds`,
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );

        const userGuildResponse = response.data;
        setGuilds(userGuildResponse.data.userGuilds);
      } catch (err) {
        console.log(err);
      }
    }

    fetchUserGuilds();
  }, []);

  return guilds;
};

function GuildList(props) {
  const userGuilds = useUserGuilds(); // get data

  return (
    <View style={styles.container}>
      <GuildProvider guildId={props.route.params?.guildId}>
        <Text style={styles.title}>Your Guilds</Text>
        <FlatList
          data={userGuilds}
          renderItem={({ item }) => (
            <GuildCard
              key={item.guildId}
              style={styles.card}
              id={item.guildId}
              navigation={props.navigation}
              avatar={item.avatar}
              name={
                item.name.length <= 28
                  ? item.name
                  : item.name.substring(0, 25) + "..."
              }
              handle={item.handler}
            />
          )}
          keyExtractor={(item) => item.guildId.toString()}
        />
      </GuildProvider>
    </View>
  );
}

GuildList.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
};

export default GuildList;
