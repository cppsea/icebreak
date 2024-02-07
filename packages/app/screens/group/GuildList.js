import React, { useEffect, useState } from "react";
// import React from "react";
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

// const groups = [
//   { id: "1", name: "Software Engineering Association", handle: "@cppsea" },
//   { id: "2", name: "Developers Guild", handle: "@devguild" },
// ];

const userId = "80eb49ef-ce2a-46e2-b440-911192976ac1"; // temporary userId

const useUserGuilds = () => {
  const [guilds, setGuilds] = useState([]);

  useEffect(() => {
    async function fetchUserGuilds() {
      try {
        const accessToken = await SecureStore.getValueFor("accessToken");

        const response = await axios.get(`${ENDPOINT}/users/${userId}/guilds`, {
          headers: {
            Authorization: accessToken,
          },
        });

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

function GuildList({ navigation, route }) {
  const userGuilds = useUserGuilds(); // get data

  return (
    <View style={styles.container}>
      <GuildProvider guildId={route.params?.guildId}>
        <Text style={styles.title}>Your Groups</Text>
        <FlatList
          data={userGuilds} // switch userGuilds to groups for using mock data
          renderItem={({ item }) => (
            <GuildCard
              key={item.guildId}
              style={styles.card}
              name={
                item.name.length <= 28
                  ? item.name
                  : item.name.substring(0, 25) + "..."
              }
              handle={item.handler}
              navigation={navigation}
              id={item.guildId}
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
