import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import PropTypes from "prop-types";
import EventCardText from "@app/components/EventCard/EventCardText";
import EventCardRegistration from "@app/components/EventCard/EventCardRegistration";
import axios from "axios";

import { ENDPOINT } from "@app/utils/constants";
import * as SecureStore from "@app/utils/SecureStore";

const DARK_GRAY = "#2C2C2C";
const WHITE = "#F5F5F5";
const EVENTID = "6e22eb57-fce2-4db7-9279-5ab6c3acfec7";

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
  const [event, setEvent] = useState([]);

  const getEvents = async () => {
    const token = await SecureStore.getValueFor("accessToken");
    const { data: response } = await axios.get(
      `${ENDPOINT}/events/${EVENTID}`,
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
    if (minutes < 10) minutes = "0" + minutes;

    return `${date.getMonth() + 1}/${date.getDate()}/${
      date.getFullYear() - 2000
    } at ${hours}:${minutes} ${dayPeriod}`;
  }

  return (
    <View style={[props.style, styles.container]} testID={props.testID}>
      {mockData.map((section) => (
        <View key={section.title}>
          <Text style={styles.header}>{section.title}</Text>
          {section.data.map((item, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={require("@app/assets/test_card_banner.png")}
                style={styles.banner}
              />
              <View style={styles.container}>
                <EventCardText
                  title={event.title}
                  timeBegin={formatDate(event.startDate)}
                  timeEnd={formatDate(event.endDate)}
                  location={event.location}
                  description={event.description}
                  navigation={props.navigation}
                  previousScreen={props.previousScreen}
                />
                <EventCardRegistration registerState={false} />
              </View>
            </View>
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
  previousScreen: PropTypes.string,
};

const styles = StyleSheet.create({
  banner: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 144,
    width: "100%",
  },
  card: {
    backgroundColor: WHITE,
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
