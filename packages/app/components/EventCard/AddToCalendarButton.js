import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import calendar from "@app/assets/calendar-icon.png";

const BLUE = "#3498DB";
const WHITE = "#FFFFFF";
const SHADOW = "rgba(0, 0, 0, 0.25)";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: BLUE,
    borderRadius: 5,
    flexDirection: "row",
    height: 35,
    justifyContent: "center",
    marginTop: 5,
    ...Platform.select({
      ios: {
        shadowColor: SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  image: {
    aspectRatio: 1,
    height: "6%",
    marginHorizontal: 10,
    width: "6%",
  },
  text: {
    color: WHITE,
  },
});

export default function AddToCalendarButton() {
  const saveEvent = async () => {
    console.log("button pressed");
    try {
      // ADD EVENT TO CALENDAR HERE
      alert("Event Added to Calendar");
    } catch (err) {
      console.log(err);
      alert("Failed to add event to calendar");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={saveEvent}>
      <Image style={styles.image} source={calendar} />
      <Text style={styles.text}>Add to Calendar</Text>
    </TouchableOpacity>
  );
}

AddToCalendarButton.propTypes = {
  registerState: PropTypes.bool,
};
