import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { ProfileScreenNavigationProps } from "@app/types/Feed";

// Placeholder profile screen
function Profile({ navigation }: ProfileScreenNavigationProps) {
  return (
    <View style={styles.screenContainer}>
      <Button onPress={() => navigation.navigate("Feed")} title="Back" />
      <Text>Profile Screen</Text>
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

export default Profile;
