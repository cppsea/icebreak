import React, { useState, useRef } from "react";
import axios from "axios";
import {
  //StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
  ImageBackground,
  Image,
} from "react-native";

import * as WebBrowser from "expo-web-browser";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";
import TextInput from "@app/components/TextInput";
import GoogleIcon from "@app/assets/google-icon";

import { useUserContext } from "@app/utils/UserContext";
import { ENDPOINT } from "@app/utils/constants";

import * as SecureStore from "@app/utils/SecureStore";

import { useGoogleLogin } from "@app/utils/useGoogleLogin";

import PropTypes from "prop-types";

import { useTheme } from "@app/utils/theme.js";

WebBrowser.maybeCompleteAuthSession();

function LandingScreen({ navigation, route }) {
  const { user, setUser } = useUserContext();

  // State to change the variable with the TextInput
  const [inputs, setInputs] = useState({
    email: route.params?.email ?? "",
    password: "",
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

    if (isValid) {
      login();
    }
  };

  const login = async () => {
    try {
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
    } catch (error) {
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

  const handleOnChange = (inputKey, text) => {
    setInputs((prevState) => ({ ...prevState, [inputKey]: text }));
  };

  const handleError = (inputKey, error) => {
    setErrors((prevState) => ({ ...prevState, [inputKey]: error }));
  };

  // Keeps a reference to help switch from Username input to Password input
  const refPasswordInput = useRef();
  const styles = useStyles();
  return (
    <Screen style={styles.screen}>
      <View style={styles.bannerContainer}>
        <Image
          source={require("@app/assets/landing-banner.png")}
          style={styles.banner}
          resizeMode="contain"
        />
      </View>
      <ImageBackground
        source={require("@app/assets/landing-background.png")}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.container}>
              <Button
                testID="googleButton"
                title="Continue with Google"
                onPress={() => useGoogleLogin(user, setUser)}
                underlayColor="#ebebeb"
                style={[styles.googleButton, styles.component]}
                fontWeight="bold"
                imageStyle={styles.imageStyle}
                icon={<GoogleIcon height={25} />}
              />
              <View style={styles.orContainer}>
                <View style={styles.lineDivider} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.lineDivider} />
              </View>

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
                underlayColor="#0e81c4"
                fontColor="#ffffff"
                fontWeight="bold"
                style={[styles.loginButton, styles.component]}
                textStyle={styles.boldText}
              />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>

          <View style={styles.signupContainer}>
            <Text style={styles.text}>Don&#39;t have an account? </Text>

            <TouchableOpacity
              testID="signupButton"
              onPress={() => {
                navigation.navigate("SignUpScreen", { email: inputs.email });
              }}>
              <Text style={styles.textButton}>Sign Up.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Screen>
  );
}

// Style sheet to keep all the styles in one place
const useStyles = () => {
  const theme = useTheme();
  return {
    text: {
      fontSize: 16,
    },
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
      paddingTop: 47,
      paddingHorizontal: 20,
      width: "100%",
    },
    forgotPassContainer: {
      alignSelf: "flex-end",
    },
    googleButton: {
      borderColor: theme.panelPrimary.opacity30,
      borderWidth: 0.5,
      backgroundColor: theme.panelPrimary.opacity0,
      fontSize: 24,
    },
    imageStyle: {
      height: 20,
      marginRight: 10,
      width: 20,
    },
    lineDivider: {
      backgroundColor: theme.textPrimary.opacity100,
      height: 0.9,
      marginVertical: 25,
      marginHorizontal: 13,
      width: "43%",
    },
    orText: {
      color: theme.textPrimary.opacity100,
      fontSize: 16,
      fontWeight: "bold",
    },
    orContainer: {
      alignItems: "center",
      flexDirection: "row",
    },
    loginButton: {
      backgroundColor: theme.brand.aegean,
      borderColor: theme.brand.aegean,
      marginTop: 40,
    },
    signupContainer: {
      alignSelf: "center",
      flexDirection: "row",
      paddingBottom: 130,
    },
    textButton: {
      color: theme.link.opacity50,
      fontWeight: "bold",
      fontSize: 16,
    },
    textInput: {
      backgroundColor: theme.panelPrimary.opacity10,
      borderWidth: 1,
      justifyContent: "space-between",
      marginBottom: 7,
      paddingHorizontal: 10,
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    screen: {
      flex: 1,
    },
    banner: {
      flex: 1,
      width: "85%",
      resizeMode: "contain",
      //maxHeight: 150,
      //marginTop: 40,
    },
    bannerContainer: {
      flex: 1,
      paddingHorizontal: 20,
      marginTop: 20,
      maxHeight: 180,
      alignItems: "center",
    },
  };
};

const isValidEmail = (email) => {
  const emailRE =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return email.match(emailRE);
};

LandingScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default LandingScreen;
