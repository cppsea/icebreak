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
}) => {
  const onRegisterClicked = () => {
    alert("Register button works!");
  };

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
        />
        <EventCardRegistration register={onRegisterClicked} />
      </View>
    </View>
  );
};

EventCard.propTypes = {
  banner: PropTypes.number,
  description: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  style: PropTypes.object,
  timeBegin: PropTypes.string.isRequired,
  timeEnd: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default EventCard;
