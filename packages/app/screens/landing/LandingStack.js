import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingScreen from "./LandingScreen";
import SignUpScreen from "./SignUpScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import ResetPasswordScreen from "./ResetPasswordScreen";

const Landing = createNativeStackNavigator();

function LandingStack() {
  return (
    <Landing.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingScreen">
      <Landing.Screen name="LandingScreen" component={LandingScreen} />
      <Landing.Screen name="SignUpScreen" component={SignUpScreen} />
      <Landing.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Landing.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Landing.Navigator>
  );
}

export default LandingStack;
