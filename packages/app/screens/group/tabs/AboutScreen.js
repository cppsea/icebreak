import React from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Screen from "@app/components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";

const BLUE = "#3498DB";
const GRAY = "#2C2C2C";

function AboutScreen() {
  return <View></View>;
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