import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const RoundedIcon = (props) => {
  const styles = StyleSheet.create({
    icon: {
      alignItems: "center",
      borderRadius: 30,
      height: 60,
      justifyContent: "center",
      overflow: "hidden",
      width: 60,
    },
    image: {
      aspectRatio: 1,
      borderRadius: 15,
      height: "100%",
      width: "100%",
    },
  });

  return (
    <TouchableOpacity style={styles.icon} onPress={props.onIconClick}>
      <Image
        style={styles.image}
        source={
          props.image
            ? { uri: props.image }
            : require("@app/assets/no-pfp-icon.png")
        }
      />
    </TouchableOpacity>
  );
};

RoundedIcon.propTypes = {
  image: PropTypes.string,
  onIconClick: PropTypes.func,
};

export default RoundedIcon;
