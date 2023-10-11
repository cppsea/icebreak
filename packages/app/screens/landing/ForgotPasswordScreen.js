import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Button,
} from "react-native";

import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";

import PropTypes from "prop-types";

const LIGHT_GRAY = "#ebebeb";

function ForgotPasswordScreen({ route }) {
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

  const validateInput = () => {
    let isValid = true;

    // Reset the error message
    for (const inputKey in inputs) {
      handleError(inputKey, null);
    }

    if (!inputs.email) {
      handleError("email", "Please enter an email.");
      isValid = false;
    } else if (!isValidEmail(inputs.email)) {
      handleError("email", "Please enter a valid email.");
      isValid = false;
    }

    return isValid;
  };

  return (
    <Screen style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}>
          <Text>This is {route.params.name}</Text>

          <TextInput
            testID="emailInput"
            value={inputs["email"]}
            container={{ marginBottom: 10 }}
            style={[styles.component, styles.textInput]}
            borderColor="#cccccc"
            onChangeText={(text) => {
              handleOnChange("email", text);
              handleError("email", null);
            }}
            error={errors.email}
            placeholder="Email"></TextInput>

          <Button
            testID="loginButton"
            title="Log In"
            onPress={() => {
              validateInput();
            }}
            underlayColor="#0e81c4"
            fontColor="#ffffff"
            fontWeight="bold"
            style={[styles.loginButton, styles.component]}
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
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  },
  textInput: {
    backgroundColor: LIGHT_GRAY,
    borderWidth: 1,
    justifyContent: "space-between",
    marginBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

const isValidEmail = (email) => {
  const emailRE =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return email.match(emailRE);
};

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ForgotPasswordScreen;
