import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GroupScreen from "./GroupScreen";
import EventOverviewScreen from "./event_overview/EventOverviewScreen";
const Group = createNativeStackNavigator();

function GroupStack() {
  return (
    <Group.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName="GroupScreen">
      <Group.Screen name="GroupScreen" component={GroupScreen} />
      <Group.Screen
        name="EventOverviewScreen"
        component={EventOverviewScreen}
      />
    </Group.Navigator>
  );
}

export default GroupStack;
