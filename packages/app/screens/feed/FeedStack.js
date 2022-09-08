import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedScreen from './FeedScreen';

const Feed = createNativeStackNavigator();

function FeedStack() {
  return (
    <Feed.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingScreen">
      <Feed.Screen name="FeedScreen" component={FeedScreen} />
    </Feed.Navigator>
  );
}

export default FeedStack;
