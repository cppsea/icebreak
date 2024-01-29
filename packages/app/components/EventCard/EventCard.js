import React from "react";
import { Image, StyleSheet, View } from "react-native";
import EventCardText from "./EventCardText";
import EventCardRegistration from "./EventCardRegistration";
import PropTypes from "prop-types";

const cardColor = "white";

const styles = StyleSheet.create({
  banner: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 144,
    margin: 0,
    width: "100%",
  },
  card: {
    backgroundColor: cardColor,
    borderRadius: 15,
    margin: 5,
    padding: 0,
  },
  container: {
    marginBottom: 0,
    padding: 10,
  },
});

const EventCard = ({
  style,
  banner,
  title,
  timeBegin,
  timeEnd,
  location,
  description,
  navigation,
  previousScreen,
}) => {
  return (
    <View style={[styles.card, style]}>
      {banner ? <Image source={banner} style={styles.banner} /> : null}
      <View style={styles.container}>
        <EventCardText
          title={title}
          timeBegin={timeBegin}
          timeEnd={timeEnd}
          location={location}
          description={description}
          navigation={navigation}
          previousScreen={previousScreen}
        />
        <EventCardRegistration registerState={false} />
      </View>
    </View>
  );
};

EventCard.propTypes = {
  banner: PropTypes.number,
  description: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  timeBegin: PropTypes.string,
  timeEnd: PropTypes.string,
  title: PropTypes.string,
  navigation: PropTypes.object,
  previousScreen: PropTypes.string,
};

export default EventCard;
