import GroupIcon from "@app/components/GroupScreen/GroupIcon";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native-gesture-handler";

const GuildCard = (props) => {
  const iconSize = 50;
  const openGuild = (groupId) => {
    alert("Opening group " + groupId + "...");
    props.navigation.navigate("GroupScreen", { groupId: groupId });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openGuild(props.id)}>
      {/* <RoundedIcon></RoundedIcon> */}
      {/* <View style={styles.avatar}> */}
      <GroupIcon
        style={styles.avatar}
        testID="groupIcon"
        // icon={props.avatar}
        icon={require("@app/assets/test-club-icon.png")}
        size={iconSize}
        backgroundColor={"#0E131F"}
        altImgStyle={styles.avatarImage}
      />
      {/* </View> */}
      <View style={styles.text}>
        <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.handle}>{props.handle}</Text>
      </View>
    </TouchableOpacity>
  );
};

GuildCard.propTypes = {
  navigation: PropTypes.object,
  id: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  handle: PropTypes.string,
  onCardClick: PropTypes.func,
};

const black = "#000000";
const grey = "#808080";
const white = "#fff";

const styles = StyleSheet.create({
  avatar: {
    width: 60,
  },
  avatarImage: {
    position: "static",
  },
  card: {
    alignItems: "center",
    backgroundColor: white,
    borderRadius: 10,
    flexDirection: "row",
    justifyItems: "center",
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

export default GuildCard;
