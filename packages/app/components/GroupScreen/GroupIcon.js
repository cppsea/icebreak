import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";

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
  return props.icon ? (
    <Image
      source={props.icon}
      style={[
        styles.iconStyle,
        {
          width: props.size,
          height: props.size,
          backgroundColor: props.backgroundColor,
        },
        props.altImgStyle,
      ]}
    />
  ) : (
    <View
      style={[
        styles.iconTextStyle,
        {
          width: props.size,
          height: props.size,
          backgroundColor: props.backgroundColor,
        },
        props.altImgStyle,
      ]}>
      <Text style={styles.iconText}>{props.guildName.charAt(0)}</Text>
    </View>
  );
}

const primary = "#33C7FF";

const styles = StyleSheet.create({
  iconStyle: {
    borderRadius: 5,
    position: "absolute",
    resizeMode: "cover",
  },
  iconText: {
    color: primary,
    fontSize: 30,
    fontWeight: "bold",
  },
  iconTextStyle: {
    alignItems: "center",
    borderColor: primary,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: "center",
    overflow: "hidden",
    position: "absolute",
    resizeMode: "cover",
  },
});

GroupIcon.propTypes = {
  altImgStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  icon: PropTypes.number,
  size: PropTypes.number,
  guildName: PropTypes.string,
  iconContainer: PropTypes.object,
};

export default GroupIcon;
