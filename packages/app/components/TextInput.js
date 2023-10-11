import React, {forwardRef, useState} from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import EyeOff from "@app/assets/eye-line-off";
import EyeOn from "@app/assets/eye-line-on";

import PropTypes from "prop-types";

const RED = "#f54242";

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    borderRadius: 10,
    height: "auto",
    width: "100%",
  },
  error: {
    color: RED,
    fontSize: 12,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  textField: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

const TextInput = forwardRef(function textInput(props, ref) {
  const [hidePassword, setHidePassword] = useState(props.password);

  return (
    <View testID={props.testID} style={[styles.container, props.container]}>
      <View
        testID={`${props.testID}.errorBorder`}
        style={[styles.textField, props.style]}
        borderColor={props.error ? "#f54242" : props.borderColor}>
        <RNTextInput
          testID={`${props.testID}.textInput`}
          value={props.value}
          style={styles.input}
          onChangeText={props.onChangeText}
          onSubmitEditing={props.onSubmitEditing}
          placeholder={props.placeholder}
          secureTextEntry={hidePassword}
          ref={ref}
        />

        {props.password && (
          <TouchableOpacity
            testID={`${props.testID}.visibility`}
            onPress={() => setHidePassword(!hidePassword)}>
            {hidePassword ? <EyeOff /> : <EyeOn />}
          </TouchableOpacity>
        )}
      </View>

      {props.error && (
        <Text testID={`${props.testID}.errorText`} style={styles.error}>
          {props.error}
        </Text>
      )}
    </View>
  );
});

TextInput.propTypes = {
  testID: PropTypes.string,
  password: PropTypes.bool,
  container: PropTypes.object,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  error: PropTypes.string,
  borderColor: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  placeholder: PropTypes.placeholder,
};

export default TextInput;
