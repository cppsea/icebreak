import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import FeedScreen from './FeedScreen';
import FeedDrawer from "./FeedDrawer";
import EventOverviewScreen from "../group/event_overview/EventOverviewScreen";

const Feed = createNativeStackNavigator();

function FeedStack() {
  return (
    <Feed.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName="LandingScreen">
      <Feed.Screen name="FeedDrawer" component={FeedDrawer} />
      <Feed.Screen name="EventOverviewScreen" component={EventOverviewScreen} />
    </Feed.Navigator>
  );
}

export default FeedStack;
