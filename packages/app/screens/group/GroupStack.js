import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GroupList from "./GroupList";
import GroupScreen from "./GroupScreen";
import EventOverviewScreen from "./event_overview/EventOverviewScreen";
const Group = createNativeStackNavigator();

function GroupStack() {
  return (
    <Group.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GroupList">
      <Group.Screen name="GroupList" component={GroupList} />
      <Group.Screen name="GroupScreen" component={GroupScreen} />
      <Group.Screen
        name="EventOverviewScreen"
        component={EventOverviewScreen}
      />
    </Group.Navigator>
  );
}

export default GroupStack;
