import React from "react";
import RoundedIcon from "@app/components/MemberCard/RoundedIcon";
import PropTypes from "prop-types";
import { Platform, StyleSheet, Text, View } from "react-native";
import { ThreeDotsButton } from "./MemberFunctions";
import ProfilePopup from "./ProfilePopup";

const containerBG = "rgb(245, 245, 245)";
const shadow = "rgba(0, 0, 0, 0.25)";
const nameColor = "rgb(51,51,51)";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: containerBG,
    borderRadius: 10,
    elevation: 1,
    flexDirection: "row",
    height: 60,
    justifyContent: "space-between",
    margin: 5,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  name: {
    alignItems: "center",
    color: nameColor,
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const MemberCard = (props) => {
  const [showPopup, setShowPopup] = React.useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <View style={styles.container}>
      <RoundedIcon image={props.image} onIconClick={openPopup} />
      <Text style={styles.name}>{props.name}</Text>
      <ThreeDotsButton />
      <ProfilePopup
        isVisible={showPopup}
        image={props.image}
        name={props.name}
        onClose={closePopup}
      />
    </View>
  );
};

MemberCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
};

export default MemberCard;
