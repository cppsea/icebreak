import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import FeedScreen from './FeedScreen';
import FeedDrawer from "./FeedDrawer";

const Feed = createNativeStackNavigator();

function FeedStack() {
  return (
    <Feed.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingScreen">
      <Feed.Screen name="FeedDrawer" component={FeedDrawer}/>
    </Feed.Navigator>
  );
}

export default FeedStack;
