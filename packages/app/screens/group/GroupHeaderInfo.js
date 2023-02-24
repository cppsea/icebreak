import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
    width: "100%",
    marginTop: 44,
  },
  titleContainer: {
    justifyContent: "center",
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: "700",
  },
  handlerContainer: {
    marginTop: -6,
  },
  handlerStyle: {
    fontSize: 13,
    color: "grey",
  },
  descriptionContainer: {
    marginTop: 12,
  },

  descriptionStyle: {
    fontSize: 13, // NOTE: Default font family; change later?
  },
});

/**
 * A component for GroupHeader that displays an organization's information.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {string} props.name - Name of org.
 * @param {string} props.handler - Handler of org, implementation already includes '@'.
 * @param {string} props.description - Description of org.
 *
 * @param {string} props.location - Location of org.
 * @param {number} props.members - Amount of members in org.
 * @param {string} props.website - Link to the website of org.
 */
function GroupHeaderInfo(props) {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>{props.name}</Text>

        <View style={styles.handlerContainer}>
          <Text style={styles.handlerStyle}>@{props.handler}</Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text
          style={styles.descriptionStyle}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {props.description}
        </Text>
      </View>
    </View>
  );
}

export default GroupHeaderInfo;
