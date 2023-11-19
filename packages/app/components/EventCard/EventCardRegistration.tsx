import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../Button";
import FaceIcon from "./FaceIcon";
import { EventCardRegistrationProps } from "@app/types/EventCard";

// Sample array for testing
const sampleArray = [0, 1, 2, 3];

const BLUE = "#0b91e0";

const styles = StyleSheet.create({
  buttonView: {
    flex: 7,
    justifyContent: "center",
  },
  button: {
    height: 35,
    borderRadius: 5,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: BLUE
  },
  faceView: {
    flexDirection: "row",
    flex: 3,
    justifyContent: "center",
  },
});

export default function EventCardRegistration(
  props: EventCardRegistrationProps
) {
  const { register } = props;

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={styles.buttonView}>
        <Button style={styles.button} fontColor="#ffffff" title="Going" onPress={register} />
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
