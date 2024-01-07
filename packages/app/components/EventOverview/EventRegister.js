import React from "react";
import { StyleSheet, View, Button } from "react-native";
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
  const handOnShare = () => {
    alert("Share");
  };

  return (
    <View style={styles.container}>
      <View style={styles.shareButton}>
        <Button title="Share" color="#1c2e4a" onPress={handOnShare} />
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
