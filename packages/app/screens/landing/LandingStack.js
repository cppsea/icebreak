import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LandingScreen from "./LandingScreen";
import SignUpScreen from "./SignUpScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

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
    </Landing.Navigator>
  );
}

export default LandingStack;
