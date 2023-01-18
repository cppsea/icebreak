import React from "react";
import { StyleSheet, Image } from "react-native";

export default function FaceIcon(props) {
  const styles = StyleSheet.create({
    height: 36,
    width: 36,
    borderRadius: 18,
    transform: [{translateX: 30 - props.index * 20}]
  });

  return <Image source={{ uri: props.iconUrl }} key={props.index} style={styles} />;
}