import React, {useState} from "react";

import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import { useUserContext } from "@app/utils/UserContext";
import { getUserInfo } from "@app/utils/datalayer";

function ForgotPasswordScreen({navigation, route }) {

  const [inputs, setInputs] = useState({
    email: route.params?.email ?? ""
  });

  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => {
    const emailRE =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.match(emailRE);
  };

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
  }
  

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
            onChangeText=
            {(text) => {
              handleOnChange("email", text);
              handleError("email", null);
            }}
            error={errors.email}
            placeholder="Email">
          </TextInput>
        </KeyboardAvoidingView>

      </TouchableWithoutFeedback>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20
  },
  component: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    backgroundColor: "#ebebeb",
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    marginBottom: 7,
  },
});

export default ForgotPasswordScreen;
