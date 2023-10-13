import React, { useState, useRef } from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";

import * as WebBrowser from "expo-web-browser";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import GoogleIcon from "@app/assets/google-icon";
import handleOnLoginWithGoogle from "@app/utils/handleOnLoginWithGoogle";

import { ENDPOINT } from "@app/utils/constants";

import DividerWithText from "@app/components/DividerWithText";

import PropTypes from "prop-types";

const BLUE = "#0b91e0";
const DARK_GRAY = "#a3a3a3";
const GRAY = "#ebebeb";

WebBrowser.maybeCompleteAuthSession();

function SignUpScreen({ navigation, route }) {
  const register = async () => {
    console.log(
      `Attempting Register with ${inputs.email} and ${inputs.password} at ${ENDPOINT}/auth/local/register`
    );
    try {
      const response = await axios.post(`${ENDPOINT}/auth/local/register`, {
        email: inputs.email,
        avatar: "avatar",
        password: inputs.password,
      });

      if (response.status === 200 && response?.data.status == "success") {
        navigation.navigate("LandingScreen", { email: inputs.email });
      }
    } catch (error) {
      const responseData = error.response.data;
      if (
        responseData.data &&
        responseData.data.email === "A user with this email already exists."
      ) {
        console.log(responseData?.data.email);
      } else {
        console.log(JSON.stringify(error));
      }
    }
  };

  // State to change the variable with the TextInput
  const [inputs, setInputs] = useState({
    email: route.params?.email ?? "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState({});

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

    if (!inputs.password) {
      handleError("password", "Please enter a password.");
      isValid = false;
    }

    if (inputs.password && !inputs.passwordConfirmation) {
      handleError("passwordConfirmation", "Please confirm password.");
      isValid = false;
    }

    if (
      inputs.password &&
      inputs.passwordConfirmation &&
      inputs.password != inputs.passwordConfirmation
    ) {
      handleError("passwordConfirmation", "Passwords do not match.");
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };

  const handleOnChange = (inputKey, text) => {
    setInputs((prevState) => ({ ...prevState, [inputKey]: text }));
  };

  const handleError = (inputKey, error) => {
    setErrors((prevState) => ({ ...prevState, [inputKey]: error }));
  };

  // Keeps a reference to help switch from Username input to Password input
  const refPasswordInput = useRef();
  const refPasswordConfirmationInput = useRef();

  return (
    <Screen style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}>
          <Text testID="logo" style={styles.logo}>
            icebreak
          </Text>
          <TextInput
            testID="emailInput"
            value={inputs["email"]}
            container={{ marginBottom: 10, marginTop: 20 }}
            style={[styles.component, styles.textInput]}
            borderColor="#cccccc"
            onChangeText={(text) => {
              // whenever we type, we set email hook and clear errors
              handleOnChange("email", text);
              handleError("email", null);
            }}
            error={errors.email}
            placeholder="Email"
            onSubmitEditing={() => {
              refPasswordInput.current.focus();
              refPasswordConfirmationInput.current.focus();
            }}
          />

          <TextInput
            testID="passwordInput"
            value={inputs["password"]}
            container={{ marginBottom: 10 }}
            ref={refPasswordInput}
            style={[styles.component, styles.textInput]}
            borderColor="#cccccc"
            onChangeText={(text) => {
              handleOnChange("password", text);
              handleError("password", null);
            }}
            error={errors.password}
            password
            placeholder="Password"
            onSubmitEditing={validateInput}
          />

          <TextInput
            testID="passwordConfirmationInput"
            value={inputs["passwordConfirmation"]}
            container={{ marginBottom: 20 }}
            ref={refPasswordConfirmationInput}
            style={[styles.component, styles.textInput]}
            borderColor="#cccccc"
            onChangeText={(text) => {
              handleOnChange("passwordConfirmation", text);
              handleError("passwordConfirmation", null);
            }}
            error={errors.passwordConfirmation}
            password
            placeholder="Confirm Password"
            onSubmitEditing={validateInput}
          />

          <Button
            testID="signupButton"
            title="Sign Up"
            onPress={() => {
              validateInput();
            }}
            underlayColor="#0e81c4"
            fontColor="#ffffff"
            fontWeight="bold"
            style={[styles.loginButton, styles.component]}
            textStyle={styles.boldText}
          />

          <DividerWithText title="or" />

          <Button
            testID="googleButton"
            title="Continue with Google"
            underlayColor="#ebebeb"
            onPress={() => handleOnLoginWithGoogle()} 
            style={[styles.googleButton, styles.component]}
            fontWeight="bold"
            imageStyle={styles.imageStyle}
            icon={<GoogleIcon height={25} />}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.signupContainer}>
        <Text>Already have an account? </Text>

        <TouchableOpacity
          testID="logInButton"
          onPress={() => {
            navigation.navigate("LandingScreen", { email: inputs.email });
          }}>
          <Text style={styles.textButton}>Log In.</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

// Style sheet to keep all the styles in one place
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
  googleButton: {
    borderColor: DARK_GRAY,
    borderWidth: 1,
  },
  imageStyle: {
    height: 20,
    marginRight: 10,
    width: 20,
  },
  loginButton: {
    backgroundColor: BLUE,
    borderColor: BLUE,
    marginTop: 30,
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    margin: 20,
  },
  signupContainer: {
    flexDirection: "row",
  },
  textButton: {
    color: BLUE,
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: GRAY,
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

SignUpScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SignUpScreen;
