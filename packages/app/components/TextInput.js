import React, { forwardRef, useState } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import EyeOff from "@app/assets/eye-line-off";
import EyeOn from "@app/assets/eye-line-on";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import PropTypes from "prop-types";

const RED = "#f54242";
const CYAN = "#489FB5";

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
  icon: {
    color: CYAN,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 18,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 5,
  },
  labelField: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
  text: {
    color: CYAN,
    marginTop: 15,
  },
  textField: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginBottom: 20,
  },
});

const TextInput = forwardRef(function textInput(props, ref) {
  const [hidePassword, setHidePassword] = useState(props.password);

  return (
    <View testID={props.testID} style={[styles.container, props.container]}>
      <View
        testID={`${props.testID}.errorBorder`}
        style={
          props.label
            ? [styles.labelField, props.style]
            : [styles.textField, props.style]
        }
        borderColor={props.error ? "#f54242" : props.borderColor}>
        <View style={styles.textField}>
          {props.email && (
            <FontAwesome5
              testID={`${props.testID}.emailIcon`}
              name="envelope"
              style={styles.icon}
            />
          )}
          {props.password && props.label && (
            <FontAwesome5
              testID={`${props.testID}.passwordIcon`}
              style={styles.icon}
              name="lock"
            />
          )}

          {props.label && (
            <Text testID={`${props.testID}.errorBorder`} style={styles.text}>
              {props.labelPlaceholder}
            </Text>
          )}
        </View>

        <View style={styles.textField}>
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
  label: PropTypes.bool,
  email: PropTypes.bool,
  password: PropTypes.bool,
  container: PropTypes.object,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  error: PropTypes.string,
  borderColor: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  placeholder: PropTypes.string,
  labelPlaceholder: PropTypes.string,
};

export default TextInput;
