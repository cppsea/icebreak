import React, { useCallback, useRef } from "react";
import axios from "axios";
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

import * as WebBrowser from "expo-web-browser";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import GoogleIcon from "@app/assets/google-icon";

import { useUserContext } from "@app/utils/UserContext";
import { ENDPOINT } from "@app/utils/constants";
import { getUserInfo } from "@app/utils/datalayer";

import EyeOff from "@app/assets/eye-line-off";
import EyeOn from "@app/assets/eye-line-on";
import * as SecureStore from "@app/utils/SecureStore";

import Constants from "expo-constants";
import DividerWithText from "@app/components/DividerWithText";

WebBrowser.maybeCompleteAuthSession();

function SignUpScreen({ navigation, route }) {
  const { user, setUser } = useUserContext();

  const register = async () => {
    console.log(
      `Attempting Register with ${inputs.email} and ${inputs.password} at ${ENDPOINT}/auth/login`
    );
    try {
      const response = await axios.post(`${ENDPOINT}/auth/register`, {
        email: inputs.email,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        password: inputs.password,
        passwordConfirmation: inputs.passwordConfirmation,
      });

      if (response?.data.success) {
        console.log("Data: " + response.data.newToken);
        setUser({
          ...user,
          isLoggedIn: true,
          data: response.data.newToken,
        });
      }
    } catch (error) {
      console.log(error.toString());
    }
  };

  // State to change the variable with the TextInput
  const [inputs, setInputs] = React.useState({
    email: route.params?.email ?? "",
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = React.useState({});

  const isValidEmail = (email) => {
    const emailRE =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.match(emailRE);
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

    if (!inputs.firstName) {
      handleError("firstName", "Please enter your first name.");
      isValid = false;
    }

    if (!inputs.lastName) {
      handleError("lastName", "Please enter your last name.");
      isValid = false;
    }

    if (!inputs.password) {
      handleError("password", "Please enter a password.");
      isValid = false;
    }

    if(inputs.password && !inputs.passwordConfirmation){
      handleError("passwordConfirmation", "Please confirm password.");
      isValid = false;
    }
    
    if((inputs.password && inputs.passwordConfirmation) && (inputs.password != inputs.passwordConfirmation)){
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
            testID="firstNameInput"
            value={inputs["firstName"]}
            container={{ marginBottom: 10 }}
            style={[styles.component, styles.textInput]}
            borderColor="#cccccc"
            onChangeText={(text) => {
              handleOnChange("firstName", text);
              handleError("firstName", null);
            }}
            error={errors.firstName}
            placeholder="First Name"
            onSubmitEditing={validateInput}
          />

          <TextInput
            testID="lastNameInput"
            value={inputs["lastName"]}
            container={{ marginBottom: 10 }}
            style={[styles.component, styles.textInput]}
            borderColor="#cccccc"
            onChangeText={(text) => {
              handleOnChange("lastName", text);
              handleError("lastName", null);
            }}
            error={errors.lastName}
            placeholder="Last Name"
            onSubmitEditing={validateInput}
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
            container={{marginBottom: 20}}
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
            onPress={() => {}} //TODO: Implement Google Sign Up
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  signupContainer: {
    flexDirection: "row",
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
  loginButton: {
    borderColor: "#0b91e0",
    backgroundColor: "#0b91e0",
    marginTop: 30,
  },
  textButton: {
    color: "#0b91e0",
    fontWeight: "bold",
  },
  forgotPassContainer: {
    alignSelf: "flex-end",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#a3a3a3",
  },
  lineDivider: {
    backgroundColor: "#c4c4c4",
    height: 1,
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  imageStyle: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  logo: {
    margin: 20,
    fontWeight: "bold",
    fontSize: 40,
  },
});

export default SignUpScreen;
