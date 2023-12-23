import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ExploreScreen from "./ExploreScreen";

const Explore = createNativeStackNavigator();

function ExploreStack() {
  return (
    <Explore.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ExploreScreen">
      <Explore.Screen name="ExploreScreen" component={ExploreScreen} />
    </Explore.Navigator>
  );
}

export default ExploreStack;
