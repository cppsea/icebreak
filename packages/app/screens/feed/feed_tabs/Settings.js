import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// Placeholder settings screen
function Settings({ navigation }) {
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

Settings.propTypes = {
  navigation: PropTypes.object,
};

export default Settings;
