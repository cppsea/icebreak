import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import PropTypes from "prop-types";

const CYAN = "#489FB5";
const GRAY = "#6D6D6D";

function ForgotPasswordScreen({ navigation, route }) {
  const [inputs, setInputs] = useState({
    email: route.params?.email ?? "",
  });

  const [errors, setErrors] = useState({});

  const handleOnChange = (inputKey, text) => {
    setInputs((prevState) => ({ ...prevState, [inputKey]: text }));
  };
  const handleError = (inputKey, error) => {
    setErrors((prevState) => ({ ...prevState, [inputKey]: error }));
  };

  return (
    <Screen style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}>
          <FontAwesome5
            name="chevron-left"
            style={[styles.component, styles.mediaIconStyle]}
            onPress={() => {
              navigation.navigate("LandingScreen", { email: inputs.email });
            }}
          />
          <Text
            testID="forgotPassword"
            style={[styles.component, styles.textTitle]}>
            Forgot Password
          </Text>

          <Text testID="info" style={[styles.component, styles.textInfo]}>
            Please enter your email for password reset instructions.
          </Text>

          <TextInput
            testID="emailInput"
            value={inputs["email"]}
            style={[styles.component, styles.textInput]}
            borderColor="#489FB5"
            onChangeText={(text) => {
              handleOnChange("email", text);
              handleError("email", null);
            }}
            error={errors.email}
            placeholder="Email"></TextInput>

          <Button
            testID="continueButton"
            title="Continue"
            underlayColor="#0e81c4"
            fontColor="#ffffff"
            fontWeight="bold"
            style={[styles.continueButton, styles.component]}
            textStyle={styles.boldText}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Screen>
  );
}
const styles = StyleSheet.create({
  component: {
    alignItems: "center",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  },
  continueButton: {
    backgroundColor: CYAN,
    borderColor: CYAN,
    marginBottom: 30,
  },
  mediaIconStyle: {
    display: "flex",
    fontSize: 22,
    marginBottom: 20,
    marginTop: 30,
    paddingRight: 10,
  },
  textInfo: {
    color: GRAY,
    fontSize: 16,
    marginBottom: 50,
  },
  textInput: {
    borderWidth: 3,
    justifyContent: "space-between",
    marginBottom: 300,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
});

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ForgotPasswordScreen;
