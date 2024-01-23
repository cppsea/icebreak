import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Screen from "@app/components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGuildContext } from "@app/utils/GuildContext";
import { URL } from "url";

const BLUE = "#3498DB";
const GRAY = "#2C2C2C";
const { guild, guildMembers } = useGuildContext();

function getIcon(url) {
  const name = new URL(url).hostname.split(".")[0];
  switch (name) {
    case "discord":
      return (
        <FontAwesome5 name="discord" style={styles.mediaIconStyle} size={20} />
      );
    case "instagram":
      return (
        <FontAwesome5
          name="instagram"
          style={styles.mediaIconStyle}
          size={20}
        />
      );
    case "facebook":
      return (
        <FontAwesome5 name="facebook" style={styles.mediaIconStyle} size={20} />
      );
    case "twitter":
      return (
        <FontAwesome5 name="twitter" style={styles.mediaIconStyle} size={20} />
      );
    case "youtube":
      return (
        <FontAwesome5 name="youtube" style={styles.mediaIconStyle} size={20} />
      );
    case "linkedin":
      return (
        <FontAwesome5 name="linkedin" style={styles.mediaIconStyle} size={20} />
      );
    default:
      return null;
  }
}
function AboutScreen() {
  return (
    <Screen style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Description</Text>
        <Text style={styles.description}>{guild.description}</Text>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>Links</Text>
        {guild.media.map((media) => (
          <View style={styles.mediaContainer} key={media}>
            {getIcon(media)}
            <Text
              style={styles.url}
              numberOfLines={1}
              ellipsizeMode="tail"
              onPress={() => Linking.openURL(media)}>
              {media}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>More Info</Text>
        <View style={styles.mediaContainer}>
          <Ionicons
            name="location-sharp"
            style={styles.mediaIconStyle}
            size={20}
            color={GRAY}
          />
          <Text>{guild.location}</Text>
        </View>
        <View style={styles.mediaContainer}>
          <Ionicons
            name="information-circle-sharp"
            style={styles.mediaIconStyle}
            size={20}
            color={GRAY}
          />
          <Text>Joined January 3, 2024</Text>
        </View>
        <View style={styles.mediaContainer}>
          <Ionicons
            name="person"
            style={styles.mediaIconStyle}
            size={20}
            color={GRAY}
          />
          <Text>{guildMembers ? guildMembers.length : 0} Members</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    flex: 1,
    marginTop: 10,
  },
  description: {
    fontSize: 15,
  },
  mediaContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    paddingLeft: 15,
  },
  mediaIconStyle: {
    color: GRAY,
    display: "flex",
    paddingRight: 10,
  },
  subContainer: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  url: {
    color: BLUE,
    flexShrink: 1,
  },
});

export default AboutScreen;
