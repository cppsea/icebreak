import React from "react";
import { View, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    resizeMode: "cover",
    borderRadius: 5,
    position: "absolute",
    top: 0,
    left: 0,
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
    <View style={[styles.iconContainer, { marginTop: -props.size / 2 }]}>
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

export default GroupIcon;
