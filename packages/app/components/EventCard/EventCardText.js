import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  description: {
    marginBottom: 10,
    fontSize: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 9,
    color: "grey",
  },
});

export default function EventCardText({
  timeBegin,
  timeEnd,
  title,
  location,
  description,
}) {
  return (
    <View>
      <Text style={styles.smallText}>
        {timeBegin} - {timeEnd}
      </Text>
      <Text style={styles.eventTitle}>{title}</Text>
      <Text style={styles.smallText}>📌 {location}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>
    </View>
  );
}
