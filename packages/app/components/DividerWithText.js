import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";

const GRAY = "#c4c4c4";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  lineDivider: {
    backgroundColor: GRAY,
    height: 1,
    marginBottom: 10,
    marginTop: 10,
    width: "40%",
  },
  textStyle: {
    alignItems: "center",
    fontWeight: "bold",
    paddingLeft: 20,
    paddingRight: 20,
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

DividerWithText.propTypes = {
  title: PropTypes.string,
};

export default DividerWithText;
