import React from "react";
import { View, StyleSheet } from "react-native";
import EventOverview from "@app/components/EventOverview/EventOverview";
import EventRegister from "@app/components/EventOverview/EventRegister";
import PropTypes from "prop-types";

const screenColor = "white";

const styles = StyleSheet.create({
  container: {
    backgroundColor: screenColor,
    flexDirection: "column",
    height: "100%",
  },
  overview: {
    flex: 9,
  },
  register: {
    flex: 1,
  },
});

export default function EventOverviewScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.overview}>
        <EventOverview
          banner={require("@app/assets/test_card_banner.png")}
          groupName="Software Engineering Association"
          title="Test"
          timeBegin="Time Begin"
          timeEnd="Time End"
          location="Test"
          description="Description"
          navigation={navigation}
        />
      </View>
      <View style={styles.register}>
        <EventRegister registerState={false} />
      </View>
    </View>
  );
}

EventOverviewScreen.propTypes = {
  navigation: PropTypes.object,
};
