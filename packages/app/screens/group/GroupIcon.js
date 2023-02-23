import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";

function GroupHeaderIcon(props) {
  const styles = StyleSheet.create({
    iconContainer: {
      position: "absolute",
      top: 91,
      left: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    iconStyle: {
      resizeMode: "cover",
      width: props.size,
      height: props.size,
      borderRadius: 5,
      backgroundColor: props.backgroundColor,
    },
    iconImage: {
      position: "absolute",
      top: 0,
      left: 0,
    },
  });

  return (
    <View style={styles.iconContainer}>
      <Image source={props.icon} style={[styles.iconStyle, styles.iconImage]} />
    </View>
  );
}

export default GroupHeaderIcon;
