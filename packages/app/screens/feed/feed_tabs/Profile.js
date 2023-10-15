import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// Placeholder profile screen
function Profile({ navigation }) {
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

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
