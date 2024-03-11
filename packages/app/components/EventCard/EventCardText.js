import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { useGuildContext } from "@app/utils/GuildContext";

const GRAY = "grey";
const titleColor = "#002366";

const styles = StyleSheet.create({
  description: {
    fontSize: 13,
    marginBottom: 10,
  },
  eventTitle: {
    color: titleColor,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 7,
  },
  eventTitlePressed: {
    color: GRAY,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 7,
    textDecorationLine: "underline",
  },
  smallText: {
    color: GRAY,
    fontSize: 12,
  },
});

function EventCardText({ event, navigation, previousScreen }) {
  const [isTitlePressed, setPressState] = useState(false);
  const { guild } = useGuildContext();

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
    if (event.startDate) {
      navigation.navigate("EventOverviewScreen", {
        previousScreen: previousScreen,
        event: event,
        timeBegin: formatDate(event.startDate),
        timeEnd: formatDate(event.endDate),
        guild: guild,
      });
    } else {
      navigation.navigate("EventOverviewScreen", {
        previousScreen: previousScreen,
        event: event,
        guild: guild,
      });
    }

    setTimeout(() => {
      setPressState(false);
    }, 500);
  };

  return (
    <View>
      {event.startDate && (
        <Text style={styles.smallText}>
          {formatDate(event.startDate)} - {formatDate(event.endDate)}
        </Text>
      )}
      <Text
        {...(isTitlePressed
          ? { style: styles.eventTitlePressed }
          : { style: styles.eventTitle })}
        onPress={onTitlePress}>
        {event.title}
      </Text>
      {event.location && (
        <Text style={styles.smallText}>📌 {event.location}</Text>
      )}
      {event.description && (
        <Text style={styles.description} numberOfLines={3}>
          {event.description}
        </Text>
      )}
    </View>
  );
}

EventCardText.propTypes = {
  event: PropTypes.any,
  navigation: PropTypes.object,
  previousScreen: PropTypes.string,
};

export default EventCardText;
