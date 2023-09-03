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
import * as Google from "expo-auth-session/providers/google";

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

import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";

WebBrowser.maybeCompleteAuthSession();


function LandingScreen({ navigation, route }) {
  const { user, setUser } = useUserContext();

  GoogleSignin.configure({
    webClientId: Constants.expoConfig.extra.webClientId,
    iosClientId: Constants.expoConfig.extra.iosClientId,
  });

  let handleOnLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn()
      const idToken = userInfo.idToken

      const body = {
        token: idToken,
      };

      const { data } = await axios.post(`${ENDPOINT}/auth/google`, body);

      console.log("response: " + JSON.stringify(data.data.user))
      if (data?.status == "success") { 
        await SecureStore.save("accessToken", data.data.accessToken);
        await SecureStore.save("refreshToken", data.data.refreshToken);
        setUser({
          ...user,
          isLoggedIn: true,
          data: data.data.user,
        });

      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Google Error: User cancelled the login flow")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Google Error: Operation (e.g. sign in) is in progress already")
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Error: Play services not available or outdated")
      } else {
        console.log(error)
      }
    }
  };

  // State to change the variable with the TextInput
  const [inputs, setInputs] = React.useState({ email: route.params?.email ?? "", password: "" });
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

    if (!inputs.password) {
      handleError("password", "Please enter a password.");
      isValid = false;
    }

    if (isValid) {
      login();
    }
  };

  const login = async () => {
    console.log(`Attempting Login with ${inputs.email} and ${inputs.password} at ${ENDPOINT}/auth/local`)
    try {
      
      const response = await axios.post(`${ENDPOINT}/auth/local`, {
        email: inputs.email,
        password: inputs.password
      })
      
      if (response?.data.status == "success") {
        await SecureStore.save("accessToken", response.data.data.accessToken);
        await SecureStore.save("refreshToken", response.data.data.refreshToken);
        setUser({
          ...user,
          isLoggedIn: true,
          data: response.data.data.user,
        });
      } else {
        console.log(response?.data.message)
      }

    } catch (error) {
      console.log(error.toString());
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
              refPasswordInput.current.focus();
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
            onPress={
              () => {
                navigation.navigate("ForgotPasswordScreen", {email: inputs.email})
              }
            }
            style={styles.forgotPassContainer}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </TouchableOpacity>

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

          <View style={styles.lineDivider} />

          <Button
            testID="googleButton"
            title="Continue with Google"
            onPress={() => handleOnLoginWithGoogle()}
            underlayColor="#ebebeb"
            style={[styles.googleButton, styles.component]}
            fontWeight="bold"
            imageStyle={styles.imageStyle}
            icon={<GoogleIcon height={25} />}
          />

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.lineDivider} />

      <View style={styles.signupContainer}>
        <Text>Don't have an account? </Text>

        <TouchableOpacity
          testID="signupButton"
          onPress={
            () => {
              navigation.navigate("SignUpScreen", { email: inputs.email })
            }
          }>
          <Text style={styles.textButton}>Sign Up.</Text>
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
  googleButton: {
    borderWidth: 1,
    borderColor: "#a3a3a3",
  },
  textButton: {
    color: "#0b91e0",
    fontWeight: "bold",
  },
  forgotPassContainer: {
    alignSelf: "flex-end",
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

export default LandingScreen;
