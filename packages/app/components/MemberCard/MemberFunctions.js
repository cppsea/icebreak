import React from "react";
import { Image, StyleSheet } from "react-native";
import OptionsMenu from "react-native-option-menu";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  buttonDots: {
    aspectRatio: 1,
    height: "100%",
    width: "100%",
  },
  smallButtonDots: {
    aspectRatio: 1,
    height: 40,
    resizeMode: "contain",
    width: 20,
  },
});

const report = () => {
  console.log("report");
};
const block = () => {
  console.log("blocked");
};

export const ThreeDotsButton = ({ isProfilePopup }) => {
  const buttonStyle = isProfilePopup
    ? styles.smallButtonDots
    : styles.buttonDots;

  const MoreIcon = (
    <Image style={buttonStyle} source={require("@app/assets/more-icon.png")} />
  );

  return (
    <OptionsMenu
      customButton={MoreIcon}
      destructiveIndex={1}
      options={["Report", "Block", "Cancel"]}
      actions={[report, block]}
    />
  );
};

ThreeDotsButton.propTypes = {
  isProfilePopup: PropTypes.bool,
};
