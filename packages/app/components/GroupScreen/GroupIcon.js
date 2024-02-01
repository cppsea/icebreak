import React from "react";
import { StyleSheet, Image } from "react-native";

import PropTypes from "prop-types";

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
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    borderRadius: 5,
    left: 0,
    position: "absolute",
    resizeMode: "cover",
    top: 0,
  },
});

GroupIcon.propTypes = {
  backgroundColor: PropTypes.string,
  icon: PropTypes.number,
  size: PropTypes.number,
};

export default GroupIcon;
