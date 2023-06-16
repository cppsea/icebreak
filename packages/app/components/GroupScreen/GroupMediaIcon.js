import React from "react";
import { View, StyleSheet } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginTop: 12,
  },
  mediaIconStyle: {
    color: "#2C2C2C",
    marginLeft: 25, // spacing between icons
  },
});

/**
 * A component for GroupHeader that displays the media icon(s) for an organization.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {number} props.size - Size of icon in pixels
 */
function GroupMediaIcon(props) {
  return (
    <View style={styles.containerStyle}>
      <FontAwesome5
        name="github"
        style={styles.mediaIconStyle}
        size={props.size}
      />
      <FontAwesome5
        name="discord"
        style={styles.mediaIconStyle}
        size={props.size}
      />
      <FontAwesome5
        name="linkedin"
        style={styles.mediaIconStyle}
        size={props.size}
      />
      <FontAwesome5
        name="instagram"
        style={styles.mediaIconStyle}
        size={props.size}
      />
    </View>
  );
}

export default GroupMediaIcon;
