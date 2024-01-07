import React from "react";
import { Image, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import EventOverviewText from "./EventOverviewText";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

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
  card: {
    backgroundColor: WHITE,
    flex: 0,
    flexDirection: "column",
  },
  container: {
    marginBottom: 0,
    padding: 10,
  },
});

export default function EventOverview({
  banner,
  groupName,
  title,
  timeBegin,
  timeEnd,
  location,
  description,
  navigation,
}) {
  const onBackPress = () => {
    navigation.navigate("GroupScreen");
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
    <View style={styles.card}>
      {banner ? <Image source={banner} style={styles.banner} /> : null}
      <BackArrow />
      <View style={styles.container}>
        <EventOverviewText
          groupName={groupName}
          title={title}
          timeBegin={timeBegin}
          timeEnd={timeEnd}
          location={location}
          description={description}
        />
      </View>
    </View>
  );
}

EventOverview.propTypes = {
  banner: PropTypes.number,
  groupName: PropTypes.string,
  description: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  timeBegin: PropTypes.string,
  timeEnd: PropTypes.string,
  title: PropTypes.string,
  navigation: PropTypes.object,
};
