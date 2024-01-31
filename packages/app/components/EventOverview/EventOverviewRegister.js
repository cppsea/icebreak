import React from "react";
import { StyleSheet, View, Button, Share, Alert } from "react-native";
import RegisterButton from "../EventCard/RegisterButton";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    flexDirection: "row",
  },
  goingButton: {
    flex: 7,
    marginRight: 15,
    marginTop: 10,
  },
  shareButton: {
    flex: 3,
    padding: 10,
  },
});

export default function EventRegister({ registerState }) {
  const handleOnShare = async () => {
    try {
      const result = await Share.share({
        message: "https://cppsea.com",
      });
      if (result.action === Share.sharedAction) {
        console.log("Content shared successfully");
      } else if (result.action === Share.dismissedAction) {
        console.log("Sharing cancelled");
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.shareButton}>
        <Button title="Share" color="#1c2e4a" onPress={handleOnShare} />
      </View>
      <View style={styles.goingButton}>
        <RegisterButton registerState={registerState} />
      </View>
    </View>
  );
}

EventRegister.propTypes = {
  registerState: PropTypes.bool,
};
