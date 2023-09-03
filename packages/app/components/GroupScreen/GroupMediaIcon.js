import React from "react";
import { View, StyleSheet, TouchableOpacity, Linking, Text, TouchableHighlight, Button } from "react-native";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";


const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginTop: 12,
    zIndex: 1
  },
  mediaIconStyle: {
    color: "#2C2C2C",
    display: 'flex',
    padding: 10
  },
  mediaButtonStyle: {
    height: 40,
    justifyContent: 'center',
    alignContent: 'center',
  }
});

/**
 * A component for GroupHeader that displays the media icon(s) for an organization.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {number} props.size - Size of icon in pixels
 * @param {githubUrl} props.githubUrl - Url for GitHub
 * @param {discordUrl} props.githubUrl - Url for Discord
 * @param {linkedinUrl} props.githubUrl - Url for LinkedIn
 * @param {instagramUrl} props.githubUrl - Url for Instagram
 */
function GroupMediaIcon(props) {
  return (
    <View style={styles.containerStyle} testID={props.testID}>

      { props.githubUrl &&
        <TouchableOpacity style={styles.mediaButtonStyle} onPress={() => Linking.openURL(props.githubUrl)}>
          <FontAwesome5
            name="github"
            style={styles.mediaIconStyle}
            size={props.size}
          />
        </TouchableOpacity>
      }

      { props.discordUrl &&
        <TouchableOpacity style={styles.mediaButtonStyle} onPress={() => Linking.openURL(props.discordUrl)}>
          <FontAwesome5
            name="discord"
            style={styles.mediaIconStyle}
            size={props.size}
          />
        </TouchableOpacity>
      }

      { props.linkedinUrl &&
        <TouchableOpacity style={styles.mediaButtonStyle} onPress={() => Linking.openURL(props.linkedinUrl)}>
          <FontAwesome5
            name="linkedin"
            style={styles.mediaIconStyle}
            size={props.size}
          />
        </TouchableOpacity>
      }

      { props.instagramUrl &&
        <TouchableOpacity style={styles.mediaButtonStyle} onPress={() => Linking.openURL(props.instagramUrl)}>
          <FontAwesome5
            name="instagram"
            style={styles.mediaIconStyle}
            size={props.size}
          />
        </TouchableOpacity>
      }

    </View>
  );
}

export default GroupMediaIcon;
