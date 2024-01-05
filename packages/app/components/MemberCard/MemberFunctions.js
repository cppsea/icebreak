import React from "react";
import { Image, StyleSheet } from "react-native";
import OptionsMenu from "react-native-option-menu";

const styles = StyleSheet.create({
  buttonDots: {
    aspectRatio: 1,
    height: "100%",
    width: "100%",
  },
});

const MoreIcon = (
  <Image
    style={styles.buttonDots}
    source={require("@app/assets/more-icon.png")}
  />
);

const report = () => {
  console.log("report");
};
const block = () => {
  console.log("blocked");
};

export const ThreeDotsButton = () => {
  return (
    <OptionsMenu
      customButton={MoreIcon}
      destructiveIndex={1}
      options={["Report", "Block", "Cancel"]}
      actions={[report, block]}
    />
  );
};
