import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Screen from "@app/components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGuildContext } from "@app/utils/GuildContext";

const BLUE = "#3498DB";
const GRAY = "#2C2C2C";
const { guild, guildMembers } = useGuildContext();

function getIcon(url) {
  let icon = "";
  if (url.startsWith("https://discord.gg/")) {
    icon = "discord";
  }
  if (url.startsWith("https://www.facebook.com/")) {
    icon = "facebook";
  }
  if (url.startsWith("https://www.instagram.com/")) {
    icon = "instagram";
  }
  if (url.startsWith("https://www.linkedin.com/")) {
    icon = "linkedin";
  }
  if (url.startsWith("https://www.twitter.com/")) {
    icon = "twitter";
  } else {
    return null;
  }

  return <FontAwesome5 name={icon} style={styles.mediaIconStyle} size={20} />;
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
