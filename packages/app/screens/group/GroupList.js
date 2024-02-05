// import React, { useEffect, useState } from "react";
import React from "react";
import { View, FlatList, Text, StyleSheet, Platform } from "react-native";
import GroupCard from "./GroupCard";
import { GuildProvider } from "@app/utils/GuildContext.js";
import PropTypes from "prop-types";

// import axios from "axios";
// import { ENDPOINT } from "@app/utils/constants.js";

const shadow = "rgba(0, 0, 0, 0.25)";
const titleColor = "rgb(51,51,51)";

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  container: {
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
        elevation: 4,
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

const groups = [
  { id: "1", name: "Software Engineering Association", handle: "@cppsea" },
  { id: "2", name: "Developers Guild", handle: "@devguild" },
];

// const userId = ""; // temporary userId <-- need from luke?
// const useUserGuilds = () => {
//   const [guilds, setGuilds] = useState([]);

//   useEffect(() => {
//     async function fetchUserGuilds() {
//       try {
//         const response = await axios.get(`${ENDPOINT}/users/${userId}/guilds`);
//         setGuilds(response.data);
//       } catch (err) {
//         console.log(err);
//       }
//     }

//     fetchUserGuilds();
//   }, []);

//   return guilds;
// };

function GroupList({ navigation, route }) {
  // const userGuilds = useUserGuilds();

  const openGuild = (groupId) => {
    console.log("Opening group " + groupId + "...");
    navigation.navigate("GroupScreen", { groupId: groupId });
  };

  return (
    <View style={styles.container}>
      <GuildProvider guildId={route.params?.guildId}>
        <Text style={styles.title}>Your Groups</Text>
        <FlatList
          data={groups} // switch groups to userGuilds after getting temp userId
          renderItem={({ item }) => (
            <GroupCard
              style={styles.card}
              name={
                item.name.length <= 28
                  ? item.name
                  : item.name.substring(0, 25) + "..."
              }
              handle={item.handle}
              onCardClick={openGuild}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </GuildProvider>
    </View>
  );
}

GroupList.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
};

export default GroupList;
