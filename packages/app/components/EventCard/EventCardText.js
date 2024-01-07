import React from "react";
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
  smallText: {
    color: GRAY,
    fontSize: 9,
  },
});

function EventCardText({
  timeBegin,
  timeEnd,
  title,
  location,
  description,
  navigation,
}) {
  const onTitlePress = () => {
    navigation.navigate("EventOverviewScreen");
  };

  return (
    <View>
      <Text style={styles.smallText}>
        {timeBegin} - {timeEnd}
      </Text>
      <Text style={styles.eventTitle} onPress={onTitlePress}>
        {title}
      </Text>
      <Text style={styles.smallText}>📌 {location}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {description}
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
  navigation: PropTypes.func,
};

export default EventCardText;
