import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import axios from "axios";

import EventOverview from "@app/components/EventOverview/EventOverview";
import EventRegister from "@app/components/EventOverview/EventRegister";
import { ENDPOINT } from "@app/utils/constants";
import * as SecureStore from "@app/utils/SecureStore";

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

export default function EventOverviewScreen({ navigation, route }) {
  const { eventID, previousScreen } = route.params;
  const [event, setEvent] = useState([]);

  const getEvents = async () => {
    const token = await SecureStore.getValueFor("accessToken");
    const { data: response } = await axios.get(
      `${ENDPOINT}/events/${eventID}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setEvent(response.data.event);
  };

  useEffect(() => {
    getEvents();
  }, []);

  function formatDate(rawDate) {
    const date = new Date(rawDate);
    let hours = date.getUTCHours();
    let minutes = date.getMinutes();
    let dayPeriod = "AM";

    if (hours > 12) {
      hours -= 12;
      dayPeriod = "PM";
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} at ${hours}:${minutes} ${dayPeriod}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overview}>
        <EventOverview
          banner={require("@app/assets/test_card_banner.png")}
          groupName="Software Engineering Association"
          title={event.title}
          timeBegin={formatDate(event.startDate)}
          timeEnd={formatDate(event.endDate)}
          location={event.location}
          description={event.description}
          navigation={navigation}
          previousScreen={previousScreen}
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
  route: PropTypes.object,
};
