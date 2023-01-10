import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  description: {
    marginBottom: 10,
    fontSize: 12
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  smallText: {
    fontSize: 9,
    color: 'grey'
  }
});

export default function EventCardText(props) {
  return (
    <View>
      <Text style={styles.smallText}>
        {props.timeBegin} - {props.timeEnd}
      </Text>
      <Text style={styles.eventTitle}>
        {props.eventTitle}
      </Text>
      <Text style={styles.smallText}>
        📌 {props.location}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {props.description}
      </Text>
    </View>
  )
}