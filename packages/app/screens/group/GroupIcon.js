import React from "react";
import { View, StyleSheet, Image } from "react-native";

const styles = StyleSheet.create({
  iconContainer: {
    position: "absolute",
    left: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    resizeMode: "cover",
    borderRadius: 5,
  },
  iconImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

/**
 * A component for GroupHeader that displays an icon for an organization.
 * It is currently coded specifically for the Group Screen (regarding its position)
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {number} props.anchor - Height of org banner, used to properly align component.
 * @param {number} props.size - Size of icon in pixels
 * @param {string} props.backgroundColor - Background color of icon.
 * @param {string} props.icon - Icon image source.
 */
function GroupIcon(props) {
  return (
    <View
      style={[styles.iconContainer, { top: props.anchor - props.size / 2 }]}
    >
      <Image
        source={props.icon}
        style={[
          styles.iconStyle,
          {
            width: props.size,
            height: props.size,
            backgroundColor: props.backgroundColor,
          },
          styles.iconImage,
        ]}
      />
    </View>
  );
}

export default GroupIcon;
