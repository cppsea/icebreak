import React from "react";
import { StyleSheet, View } from "react-native";
import FaceIcon from "./FaceIcon";
import PropTypes from "prop-types";
import RegisterButton from "./RegisterButton";

// Sample array for testing
const sampleArray = [0, 1, 2, 3];

const styles = StyleSheet.create({
  buttonView: {
    flex: 7,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
  },
  faceView: {
    flexDirection: "row",
    flex: 3,
    justifyContent: "center",
  },
});

function EventCardRegistration(props) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonView}>
        <RegisterButton registerState={props.registerState} />
      </View>
      <View style={styles.faceView}>
        {sampleArray.slice(0, 4).map((x) => {
          return (
            <FaceIcon
              key={sampleArray.indexOf(x)}
              index={x}
              iconUrl={
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
            />
          );
        })}
      </View>
    </View>
  );
}

EventCardRegistration.propTypes = {
  registerState: PropTypes.bool,
};

export default EventCardRegistration;
