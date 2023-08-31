import React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Image,
  Text,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  textStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: "center",
    fontWeight: "bold"
  },
  lineDivider: {
    backgroundColor: "#c4c4c4",
    height: 1,
    width: "40%",
    marginTop: 10,
    marginBottom: 10,
  },
});

function DividerWithText(props) {
  return (
    <View style={styles.container}>
      <View style={styles.lineDivider} />
      <Text style={styles.textStyle}>{props.title}</Text>
      <View style={styles.lineDivider} />
    </View>
  );
}

export default DividerWithText;
