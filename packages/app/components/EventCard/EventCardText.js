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

function EventCardText({ event, navigation, previousScreen }) {
  const [isTitlePressed, setPressState] = useState(false);

  function formatDate(rawDate) {
    const date = new Date(rawDate);
    let hours = date.getUTCHours();
    let minutes = date.getMinutes();
    let dayPeriod = "AM";

    if (hours > 12) {
      hours -= 12;
      dayPeriod = "PM";
    }
    if (minutes < 10) minutes = "0" + minutes;

    return `${date.getMonth() + 1}/${date.getDate()}/${
      date.getFullYear() - 2000
    } at ${hours}:${minutes} ${dayPeriod}`;
  }

  const onTitlePress = () => {
    setPressState(true);
    navigation.navigate("EventOverviewScreen", {
      previousScreen: previousScreen,
      event: event,
      timeBegin: formatDate(event.startDate),
      timeEnd: formatDate(event.endDate),
    });

    setTimeout(() => {
      setPressState(false);
    }, 500);
  };

  return (
    <View>
      <Text style={styles.smallText}>
        {formatDate(event.startDate)} - {formatDate(event.endDate)}
      </Text>
      <Text
        {...(isTitlePressed
          ? { style: styles.eventTitlePressed }
          : { style: styles.eventTitle })}
        onPress={onTitlePress}>
        {event.title}
      </Text>
      <Text style={styles.smallText}>📌 {event.location}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {event.description}
      </Text>
    </View>
  );
}

EventCardText.propTypes = {
  event: PropTypes.any,
  navigation: PropTypes.object,
  previousScreen: PropTypes.string,
};

export default EventCardText;
