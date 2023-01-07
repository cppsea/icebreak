import React from "react";
import { Text, StyleSheet, Image } from "react-native";

export default function FaceIcon(props) {
  const styles = StyleSheet.create({
    height: 36,
    width: 36,
    borderRadius: 18,
    transform: [{translateX: 30 - props.index * 20}]
  });

  return <Image source={props.source} key={props.index} style={styles} />;
}