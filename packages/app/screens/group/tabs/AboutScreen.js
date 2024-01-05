import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Screen from "@app/components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";

const BLUE = "#3498DB";
const GRAY = "#2C2C2C";

function AboutScreen() {
  return (
    <Screen style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.title}>Description</Text>
        <Text style={styles.description}>
          Hey everyone, this is so fun! HOORAY!!! Hey everyone, this is so fun!
          HOORAY!!! Hey everyone, this is so fun! HOORAY!!!
        </Text>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>Links</Text>
        <View style={styles.mediaContainer}>
          <FontAwesome5
            name="discord"
            style={styles.mediaIconStyle}
            size={20}
          />
          <Text
            style={styles.url}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Linking.openURL("https://discord.com")}>
            https://discord.com
          </Text>
        </View>
        <View style={styles.mediaContainer}>
          <FontAwesome5
            name="instagram"
            style={styles.mediaIconStyle}
            size={20}
          />
          <Text
            style={styles.url}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Linking.openURL("https://instagram.com")}>
            https://instagram.com
          </Text>
        </View>
      </View>

      <View style={styles.subContainer}>
        <Text style={styles.title}>More Info</Text>
        <View style={styles.mediaContainer}>
          <Ionicons
            name="location-sharp"
            style={styles.mediaIconStyle}
            size={20}
            color="#2C2C2C"
          />
          <Text>Pomona, CA</Text>
        </View>
        <View style={styles.mediaContainer}>
          <Ionicons
            name="information-circle-sharp"
            style={styles.mediaIconStyle}
            size={20}
            color="#2C2C2C"
          />
          <Text>Joined January 3, 2024</Text>
        </View>
        <View style={styles.mediaContainer}>
          <Ionicons
            name="person"
            style={styles.mediaIconStyle}
            size={20}
            color="#2C2C2C"
          />
          <Text>1,000 Members</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subContainer: {
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  mediaContainer: {
    flexDirection: "row",
    allignItems: "center",
    marginBottom: 10,
    paddingLeft: 15,
  },
  url: {
    color: BLUE,
    flexShrink: 1,
  },
  mediaIconStyle: {
    color: GRAY,
    display: "flex",
    paddingRight: 10,
  },
});

export default AboutScreen;
