import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";

const BLUE = "#3498DB";
const LIGHT_GRAY = "#E4E4E4";

const styles = StyleSheet.create({
  tagContainer: {
    alignItems: "center",
    backgroundColor: BLUE,
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: 4,
    marginRight: 7,
  },
  textStyle: {
    color: LIGHT_GRAY,
    fontSize: 12,
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

GroupTag.propTypes = {
  text: PropTypes.string,
};

export default GroupTag;
