import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from './LandingScreen';
import SignUpScreen from './SignUpScreen';

const Landing = createNativeStackNavigator();

function LandingStack() {
  return (
    <Landing.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingScreen">
      <Landing.Screen name="LandingScreen" component={LandingScreen} />
      <Landing.Screen name="SignUpScreen" component={SignUpScreen} />
    </Landing.Navigator>
  );
}

export default LandingStack;
