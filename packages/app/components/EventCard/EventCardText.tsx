import { EventTextProps } from "@app/types/EventCard";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const GRAY = "grey";

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  smallText: {
    color: GRAY,
    fontSize: 9,
  },
});

const EventCardText: React.FC<EventTextProps> = ({
  timeBegin,
  timeEnd,
  title,
  location,
  description,
}) => {
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
};

export default EventCardText;
