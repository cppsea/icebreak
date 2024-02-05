import React from "react";
import { View, FlatList, Text, StyleSheet, Platform } from "react-native";
import GroupCard from "./GroupCard";
import { GuildProvider } from "@app/utils/GuildContext.js";
import PropTypes from "prop-types";

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

function GroupList({ route }) {
  const openGuild = () => {
    console.log("guild card clicked");
    // figure out how to make this the specific guild (prob need to use guild context)
  };

  return (
    <View style={styles.container}>
      <GuildProvider guildId={route.params?.guildId}>
        <Text style={styles.title}>Your Groups</Text>
        <FlatList
          data={groups}
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
  route: PropTypes.any,
};

export default GroupList;
