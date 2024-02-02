// import RoundedIcon from "@app/components/MemberCard/RoundedIcon";
import GroupIcon from "@app/components/GroupScreen/GroupIcon";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// import { useGuildContext } from "@app/utils/GuildContext";

const GroupCard = (props) => {
  // const { guild } = useGuildContext();
  const iconSize = 50;

  return (
    <View style={styles.card}>
      {/* <RoundedIcon></RoundedIcon> */}
      <View style={styles.avatar}>
        <GroupIcon
          testID="groupIcon"
          // icon={guild.avatar}
          icon={require("@app/assets/test-club-icon.png")}
          size={iconSize}
          backgroundColor={"#0E131F"}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.handle}>{props.handle}</Text>
      </View>
    </View>
  );
};

GroupCard.propTypes = {
  name: PropTypes.string,
  handle: PropTypes.string,
};

const black = "#000000";
const grey = "#808080";
const white = "#fff";

const styles = StyleSheet.create({
  // card: {
  //   alignItems: "center",
  //   backgroundColor: white,
  //   borderRadius: 10,
  //   elevation: 3,
  //   flexDirection: "row",
  //   margin: 10,
  //   overflow: "hidden",
  //   padding: 10,
  // shadowColor: black,
  // shadowOffset: { width: 0, height: 2 },
  // shadowOpacity: 0.2,
  // shadowRadius: 5,
  // },
  avatar: {
    width: 60,
  },
  card: {
    // alignItems: "center",
    backgroundColor: white,
    borderRadius: 10,
    flexDirection: "row",
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  handle: {
    color: grey,
    fontSize: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    marginLeft: 10,
  },
});

export default GroupCard;
