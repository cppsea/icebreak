import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GroupIcon from "../GroupScreen/GroupIcon";
import PropTypes from "prop-types";

const GRAY = "grey";
const iconSize = 40;

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    marginTop: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  groupIcon: {
    flex: 1.2,
  },
  groupName: {
    flex: 7,
    fontSize: 19,
    fontWeight: "bold",
    marginRight: 5,
    marginTop: 5,
  },
  overviewHeader: {
    flexDirection: "row",
  },
  smallText: {
    color: GRAY,
    fontSize: 16,
    marginTop: 10,
  },
});

const OverviewHeader = ({ groupName }) => {
  return (
    <View style={styles.overviewHeader}>
      <View style={styles.groupIcon}>
        <GroupIcon
          testID="groupIcon"
          icon={require("@app/assets/test-club-icon.png")}
          size={iconSize}
          backgroundColor="#0E131F"
        />
      </View>
      <Text style={styles.groupName}>{groupName}</Text>
    </View>
  );
};

export default function EventOverviewText({
  event,
  guild,
  timeBegin,
  timeEnd,
}) {
  return (
    <View>
      <OverviewHeader groupName={guild.name} />
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.smallText}>
        {timeBegin} - {timeEnd}
      </Text>
      <Text style={styles.smallText}> 📌 {event.location} </Text>
      <Text style={styles.description}> {event.description} </Text>
    </View>
  );
}

EventOverviewText.propTypes = {
  guild: PropTypes.any,
  event: PropTypes.any,
  timeBegin: PropTypes.string,
  timeEnd: PropTypes.string,
};

OverviewHeader.propTypes = {
  groupName: PropTypes.string,
};
