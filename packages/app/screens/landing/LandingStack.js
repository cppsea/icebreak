import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingHome from './LandingHome';

const Landing = createNativeStackNavigator();

function LandingStack() {
  return (
    <Landing.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingHome">
      <Landing.Screen name="LandingHome" component={LandingHome} />
    </Landing.Navigator>
  );
}

export default LandingStack;
