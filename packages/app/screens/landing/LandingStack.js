import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingHome from './LandingHome';
import WebLogin from './WebLogin';

const Landing = createNativeStackNavigator();

function LandingStack() {
  return (
    <Landing.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingHome">
      <Landing.Screen name="LandingHome" component={LandingHome} />
      <Landing.Screen name="WebLogin" component={WebLogin} />
    </Landing.Navigator>
  );
}

export default LandingStack;
