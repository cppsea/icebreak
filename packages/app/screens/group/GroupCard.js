import RoundedIcon from "@app/components/MemberCard/RoundedIcon";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const GroupCard = ({ group }) => {
  return (
    <View style={styles.card}>
      <RoundedIcon></RoundedIcon>
      <View style={styles.text}>
        <Text style={styles.name}>{group.name}</Text>
        <Text style={styles.handle}>{group.handle}</Text>
      </View>
    </View>
  );
};

GroupCard.propTypes = {
  group: PropTypes.object.isRequired,
};

const black = "#000000";
const grey = "#808080";
const white = "#fff";

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: white,
    borderRadius: 5,
    elevation: 3,
    flexDirection: "row",
    marginBottom: 10,
    overflow: "hidden",
    padding: 10,
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
