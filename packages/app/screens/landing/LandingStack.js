import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from './LandingScreen';

const Landing = createNativeStackNavigator();

function LandingStack() {
  return (
    <Landing.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingScreen">
      <Landing.Screen name="LandingScreen" component={LandingScreen} />
    </Landing.Navigator>
  );
}

export default LandingStack;
