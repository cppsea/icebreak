import React from "react";
import { StyleSheet, TouchableHighlight, View, Text } from "react-native";
import PropTypes from "prop-types";

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

function Button(props) {
  return (
    <TouchableHighlight {...props}>
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

Button.propTypes = {
  fontColor: PropTypes.string,
  fontWeight: PropTypes.string,
  icon: PropTypes.node,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
};

export default Button;
