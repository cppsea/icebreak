import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

function GroupHeaderText(props) {
  const styles = StyleSheet.create({
    containerStyle: {
      position: "absolute",
      marginLeft: 12,
      width: Dimensions.get("window").width - 24, // sets right margin to 12px
    },
    titleStyle: {
      fontSize: 18,
      fontWeight: "700",
      position: "absolute",
      top: props.anchor + 44,
    },
    handlerStyle: {
      fontSize: 14,
      color: "grey",
      position: "absolute",
      top: props.anchor + 63,
    },
    descriptionStyle: {
      // NOTE: Default font family; change later?
      fontSize: 12,
      position: "absolute",
      top: props.anchor + 90,
    },
  });

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>{props.name}</Text>
      <Text style={styles.handlerStyle}>@{props.handler}</Text>
      <Text
        style={styles.descriptionStyle}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {props.description}
      </Text>
    </View>
  );
}

export default GroupHeaderText;
