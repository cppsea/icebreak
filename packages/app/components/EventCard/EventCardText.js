import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

const GRAY = "grey";
const titleColor = "#002366";

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    marginBottom: 10,
  },
  eventTitle: {
    color: titleColor,
    fontSize: 20,
    fontWeight: "bold",
  },
  eventTitlePressed: {
    color: GRAY,
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  smallText: {
    color: GRAY,
    fontSize: 9,
  },
});

function EventCardText(props) {
  const [isTitlePressed, setPressState] = useState(false);
  const onTitlePress = () => {
    setPressState(true);
    props.navigation.navigate("EventOverviewScreen", {
      previousScreen: props.previousScreen,
      title: props.title,
      timeBegin: props.timeBegin,
      timeEnd: props.timeEnd,
      location: props.location,
      description: props.description,
    });

    setTimeout(() => {
      setPressState(false);
    }, 500);
  };

  return (
    <View>
      <Text style={styles.smallText}>
        {props.timeBegin} - {props.timeEnd}
      </Text>
      <Text
        {...(isTitlePressed
          ? { style: styles.eventTitlePressed }
          : { style: styles.eventTitle })}
        onPress={onTitlePress}>
        {props.title}
      </Text>
      <Text style={styles.smallText}>📌 {props.location}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {props.description}
      </Text>
    </View>
  );
}

EventCardText.propTypes = {
  description: PropTypes.string,
  location: PropTypes.string,
  timeBegin: PropTypes.string,
  timeEnd: PropTypes.string,
  title: PropTypes.string,
  navigation: PropTypes.object,
  previousScreen: PropTypes.string,
};

export default EventCardText;
