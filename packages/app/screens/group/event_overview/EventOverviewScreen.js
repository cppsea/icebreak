import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";
import axios from "axios";

import EventOverviewText from "@app/components/EventOverview/EventOverviewText";
import EventOverviewRegister from "@app/components/EventOverview/EventOverviewRegister";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ENDPOINT } from "@app/utils/constants";
import * as SecureStore from "@app/utils/SecureStore";

const WHITE = "white";
const transparentColor = "#00000077";

const styles = StyleSheet.create({
  backArrow: {
    color: WHITE,
    padding: 5.2,
  },
  backArrowView: {
    backgroundColor: transparentColor,
    borderRadius: 29 / 2,
    height: 29,
    left: 5,
    position: "absolute",
    resizeMode: "cover",
    top: 5,
    width: 29,
  },
  banner: {
    height: 160,
    resizeMode: "cover",
    width: "100%",
  },
  container: {
    backgroundColor: WHITE,
    flexDirection: "column",
    height: "100%",
  },
  overview: {
    flex: 8,
    padding: 10,
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
    if (minutes < 10) minutes = "0" + minutes;

    return `${date.getMonth() + 1}/${date.getDate()}/${
      date.getFullYear() - 2000
    } at ${hours}:${minutes} ${dayPeriod}`;
  }

  const onBackPress = () => {
    navigation.navigate(previousScreen);
  };

  const BackArrow = () => {
    return (
      <View style={styles.backArrowView}>
        <FontAwesome5
          name="arrow-left"
          size={18}
          style={styles.backArrow}
          onPress={onBackPress}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@app/assets/test_card_banner.png")}
        style={styles.banner}
      />
      <BackArrow />
      <View style={styles.overview}>
        <EventOverviewText
          groupName="Software Engineering Association"
          title={event.title}
          timeBegin={formatDate(event.startDate)}
          timeEnd={formatDate(event.endDate)}
          location={event.location}
          description={event.description}
        />
      </View>
      <View style={styles.register}>
        <EventOverviewRegister registerState={false} />
      </View>
    </View>
  );
}

EventOverviewScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
