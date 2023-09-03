import React from "react";
import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  tagContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3498DB",
    borderRadius: 5,
    marginRight: 7,
    marginBottom: 4,
  },
  textStyle: {
    fontSize: 12,
    color: "#E4E4E4",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});

/**
 * A component for GroupHeader that displays a tag for an organization.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {string} props.text - Text on the tag.
 */
function GroupTag(props) {
  return (
    <View style={styles.tagContainer}>
      <Text style={styles.textStyle}>{props.text}</Text>
    </View>
  );
}

export default GroupTag;
