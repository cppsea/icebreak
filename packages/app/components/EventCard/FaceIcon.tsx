import { FaceIconProps } from "@app/types/EventCard";
import React from "react";
import { Image, StyleSheet } from "react-native";

const FaceIcon: React.FC<FaceIconProps> = (props) => {
  const { index, iconUrl } = props;

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
      source={{ uri: iconUrl }}
      key={index}
      style={styles.imageStyle}
    />
  );
};

export default FaceIcon;
