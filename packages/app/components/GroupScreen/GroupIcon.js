import React from "react";
import { View, StyleSheet, Image } from "react-native";

import PropTypes from "prop-types";

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    borderRadius: 5,
    left: 0,
    position: "absolute",
    resizeMode: "cover",
    top: 0,
  },
});

/**
 * A component for GroupHeader that displays an icon for an organization.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {number} props.size - Size of icon in pixels
 * @param {string} props.backgroundColor - Background color of icon.
 * @param {string} props.icon - Icon image source.
 */
function GroupIcon(props) {
  return (
    <View
      style={[styles.iconContainer, { marginTop: -props.size / 2 }]}
      testID={props.testID}>
      <Image
        source={props.icon}
        style={[
          styles.iconStyle,
          {
            width: props.size,
            height: props.size,
            backgroundColor: props.backgroundColor,
          },
        ]}
      />
    </View>
  );
}

GroupIcon.propTypes = {
  backgroundColor: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.number,
  testID: PropTypes.string,
};

export default GroupIcon;
