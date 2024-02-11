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

export default function EventOverviewText(props) {
  return (
    <View>
      <OverviewHeader groupName={props.groupName} />
      <Text style={styles.eventTitle}>{props.title}</Text>
      <Text style={styles.smallText}>
        {props.timeBegin} - {props.timeEnd}
      </Text>
      <Text style={styles.smallText}> 📌 {props.location} </Text>
      <Text style={styles.description}> {props.description} </Text>
    </View>
  );
}

EventOverviewText.propTypes = {
  groupName: PropTypes.string,
  description: PropTypes.string,
  location: PropTypes.string,
  timeBegin: PropTypes.string,
  timeEnd: PropTypes.string,
  title: PropTypes.string,
};

OverviewHeader.propTypes = {
  groupName: PropTypes.string,
};
