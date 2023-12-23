import { SettingsScreenNavigationProps } from "@app/types/Feed";
import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";

// Placeholder settings screen
function Settings({ navigation }: SettingsScreenNavigationProps) {
  return (
    <View style={styles.screenContainer}>
      <Button onPress={() => navigation.navigate("Feed")} title="Back" />
      <Text>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default Settings;
