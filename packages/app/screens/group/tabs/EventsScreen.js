import EventCard from "@app/components/EventCard/EventCard";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";

const DARK_GRAY = "#2C2C2C";
const WHITE = "#F5F5F5";

const mockData = [
  {
    title: "Wednesday, April 6",
    data: ["Pizza", "Burger", "Risotto"],
  },
  {
    title: "Friday, April 8",
    data: ["Pizza", "Burger"],
  },
  {
    title: "Sunday, April 10",
    data: ["Pizza"],
  },
];

function EventsScreen(props) {
  return (
    <View style={[props.style, styles.container]} testID={props.testID}>
      {mockData.map((section) => (
        <View key={section.title}>
          <Text style={styles.header}>{section.title}</Text>
          {section.data.map((item, index) => (
            <EventCard
              key={index}
              style={styles.card}
              banner={require("@app/assets/test_card_banner.png")}
              title="Test"
              timeBegin="test"
              timeEnd="test"
              location="test"
              description="test"
              navigation={props.navigation}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

EventsScreen.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    margin: 10,
  },
  header: {
    backgroundColor: WHITE,
    color: DARK_GRAY,
    fontSize: 20,
    fontWeight: "700",
  },
});

export default EventsScreen;
