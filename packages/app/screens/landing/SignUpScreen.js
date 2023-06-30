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

import { useUserContext } from "@app/utils/UserContext";
import { ENDPOINT } from "@app/utils/constants";
import { getUserInfo } from "@app/utils/datalayer";

import EyeOff from "@app/assets/eye-line-off";
import EyeOn from "@app/assets/eye-line-on";
import * as SecureStore from "@app/utils/SecureStore";

import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();


function SignUpScreen({ navigation }) {
    const { user, setUser } = useUserContext();

    const register = async () => {
        console.log(`Attempting Register with ${inputs.email} and ${inputs.password} at ${ENDPOINT}/auth/login`)
        try {
          const response = await axios.post(`${ENDPOINT}/auth/register`, {
            email: inputs.email,
            password: inputs.password
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
          console.log(error);
        }
    };

    return (
        <Screen style={styles.container}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}>
                


                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

            <View style={styles.lineDivider} />

            <View style={styles.signupContainer}>
                <Text>Already have an account? </Text>

                <TouchableOpacity
                testID="signupButton"
                onPress={
                    () => {
                        navigation.navigate("LandingScreen")
                    }
                }>
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
  textButton: {
    color: "#0b91e0",
    fontWeight: "bold",
  },
  lineDivider: {
    backgroundColor: "#c4c4c4",
    height: 1,
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SignUpScreen;