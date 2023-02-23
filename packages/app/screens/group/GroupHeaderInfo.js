import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

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
  },
  handlerStyle: {
    fontSize: 13,
    color: "grey",
    position: "absolute",
  },
  descriptionStyle: {
    fontSize: 13, // NOTE: Default font family; change later?
    position: "absolute",
  },
});

/**
 * A component for GroupHeader that displays an organization's name, handler, and description.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {number} props.anchor - Height of org banner, used to properly align components.
 * @param {string} props.name - Name of org.
 * @param {string} props.handler - Handler of org, implementation already includes '@'.
 * @param {string} props.description - Description of org.
 */
function GroupHeaderInfo(props) {
  return (
    <View style={styles.containerStyle}>
      <Text style={[styles.titleStyle, { top: props.anchor + 44 }]}>
        {props.name}
      </Text>

      <Text style={[styles.handlerStyle, { top: props.anchor + 65 }]}>
        @{props.handler}
      </Text>

      <Text
        style={[styles.descriptionStyle, { top: props.anchor + 95 }]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {props.description}
      </Text>
    </View>
  );
}

export default GroupHeaderInfo;
