import React, { useState } from "react";

import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import Button from "@app/components/Button";

import { ForgotPasswordScreenNavigationProps } from "@app/types/Landing";

const BLUE = "#0b91e0";
const LIGHT_GRAY = "#ebebeb";

function ForgotPasswordScreen({ route }: ForgotPasswordScreenNavigationProps) {
  const [inputs, setInputs] = useState({
    email: route.params?.email ?? "",
  });

  const [errors, setErrors] = useState({ email: null });

  const handleOnChange = (inputKey: string, text: string | null) => {
    setInputs((prevState) => ({ ...prevState, [inputKey]: text }));
  };
  const handleError = (inputKey: string, error: string | null) => {
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
            placeholder="Email"
            onSubmitEditing={() => console.log("Run Forgot Password...")}
          />

          <Button
            testID="resetButton"
            title="Reset Password"
            onPress={() => {
              validateInput();
            }}
            underlayColor="#0e81c4"
            fontColor="#ffffff"
            fontWeight="bold"
            style={[styles.resetButton, styles.component]}
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
  resetButton: {
    backgroundColor: BLUE,
    borderColor: BLUE,
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

const isValidEmail = (email: string) => {
  const emailRE =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return email.match(emailRE);
};

export default ForgotPasswordScreen;
