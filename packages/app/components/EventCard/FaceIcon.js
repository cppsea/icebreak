import React from "react";
import { StyleSheet, Image } from "react-native";
import PropTypes from "prop-types";

function FaceIcon(props) {
  const styles = StyleSheet.create({
    imageStyle: {
      borderRadius: 18,
      height: 36,
      transform: [{ translateX: 30 - props.index * 20 }],
      width: 36,
    },
  });

  return (
    <Image
      source={{ uri: props.iconUrl }}
      key={props.index}
      style={styles.imageStyle}
    />
  );
}

FaceIcon.propTypes = {
  iconUrl: PropTypes.string,
  index: PropTypes.number,
};

export default FaceIcon;
