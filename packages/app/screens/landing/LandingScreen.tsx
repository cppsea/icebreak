import React, { useState, useRef } from "react";
import axios, { Axios, AxiosError } from "axios";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
  TextInput as RNTextInput,
} from "react-native";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import GoogleIcon from "@app/assets/google-icon";

import { useUserContext } from "@app/utils/UserContext";
import * as WebBrowser from "expo-web-browser";

import { ENDPOINT } from "@app/utils/constants";

import * as SecureStore from "@app/utils/SecureStore";

import { useGoogleLogin } from "@app/utils/useGoogleLogin";
import { LandingScreenNavigationProps } from "@app/types/Landing";

WebBrowser.maybeCompleteAuthSession();

const BLUE = "#0b91e0";
const DARK_GRAY = "#a3a3a3";
const GRAY = "#c4c4c4";
const LIGHT_GRAY = "#ebebeb";

function LandingScreen({ navigation, route }: LandingScreenNavigationProps) {
  const { user, setUser } = useUserContext();

  // State to change the variable with the TextInput
  const [inputs, setInputs] = useState({
    email: route.params?.email ?? "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: null, password: null });

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

    if (isValid) {
      login();
    }
  };

  const login = async () => {
    try {
      console.log(`${ENDPOINT}/auth/local`);
      const response = await axios.post(`${ENDPOINT}/auth/local`, {
        email: inputs.email,
        password: inputs.password,
      });

      if (response?.data.status == "success") {
        await SecureStore.save("accessToken", response.data.data.accessToken);
        await SecureStore.save("refreshToken", response.data.data.refreshToken);
        setUser({
          ...user,
          isLoggedIn: true,
          data: response.data.data.user,
        });
      } else {
        console.log(response?.data.message);
      }
    } catch (error: any) {
      const responseData = error.response.data;
      if (
        responseData.data &&
        (responseData.data.email === "A user with that email does not exist." ||
          responseData.data.password === "Incorrect password")
      ) {
        handleError("email", "Invalid email or password.");
      } else {
        console.log(JSON.stringify(error));
      }
    }
  };

  const handleOnChange = (inputKey: string, text: string | null) => {
    setInputs((prevState) => ({ ...prevState, [inputKey]: text }));
  };

  const handleError = (inputKey: string, error: string | null) => {
    setErrors((prevState) => ({ ...prevState, [inputKey]: error }));
  };

  // Keeps a reference to help switch from Username input to Password input
  const refPasswordInput = useRef<RNTextInput>(null);

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
            container={{ marginBottom: 10 }}
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
              refPasswordInput.current?.focus();
            }}
          />

          <TextInput
            testID="passwordInput"
            value={inputs["password"]}
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

          <TouchableOpacity
            testID="forgotPassButton"
            onPress={() => {
              navigation.navigate("ForgotPasswordScreen", {
                email: inputs.email,
              });
            }}
            style={styles.forgotPassContainer}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            testID="loginButton"
            title="Log In"
            onPress={() => {
              validateInput();
            }}
            fontColor="#ffffff"
            fontWeight="bold"
            style={[styles.loginButton, styles.component]}
          />

          <View style={styles.lineDivider} />

          <Button
            testID="googleButton"
            title="Continue with Google"
            onPress={() => useGoogleLogin({user, setUser})}
            style={[styles.googleButton, styles.component]}
            fontWeight="bold"
            imageStyle={styles.imageStyle}
            icon={<GoogleIcon height={25} />}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.lineDivider} />

      <View style={styles.signupContainer}>
        <Text>Don&#39;t have an account? </Text>

        <TouchableOpacity
          testID="signupButton"
          onPress={() => {
            navigation.navigate("SignUpScreen", { email: inputs.email });
          }}>
          <Text style={styles.textButton}>Sign Up.</Text>
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
  forgotPassContainer: {
    alignSelf: "flex-end",
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
  lineDivider: {
    backgroundColor: GRAY,
    height: 1,
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
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

export default LandingScreen;
