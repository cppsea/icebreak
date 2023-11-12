import React from "react";
import { StyleSheet, TouchableHighlight, View, Text } from "react-native";
import PropTypes from "prop-types";
import { ButtonProps } from "@app/types/Button.ts";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  textStyle: {
    alignItems: "center",
  },
});

function Button(props: ButtonProps) {
  return (
    <TouchableHighlight {...props} style={[styles.container, props.style]} onPress={props.onPress} disabled={props.disabled}>
      <View style={styles.container}>
        {props.icon}

        <Text
          style={[
            {
              color: props.fontColor,
              fontWeight: props.fontWeight,
            },
            props.textStyle,
            styles.textStyle,
          ]}>
          {props.title}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

export default Button;
