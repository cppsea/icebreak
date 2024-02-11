import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Screen from "@app/components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGuildContext } from "@app/utils/GuildContext";

const BLUE = "#3498DB";
const GRAY = "#2C2C2C";

function getIcon(url) {
  let icon = "link";

  if (url.includes("discord")) {
    icon = "discord";
  } else if (url.includes("facebook")) {
    icon = "facebook";
  } else if (url.includes("instagram")) {
    icon = "instagram";
  } else if (url.includes("linkedin")) {
    icon = "linkedin";
  } else if (url.includes("twitter") || url.includes("x.com")) {
    icon = "twitter";
  } else if (url.includes("github")) {
    icon = "github";
  }

  return <FontAwesome5 name={icon} style={styles.mediaIconStyle} size={20} />;
}

function AboutScreen() {
  const { guild, guildMembers } = useGuildContext();
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
