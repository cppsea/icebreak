import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GroupList from "./GroupList";
import GroupScreen from "./GroupScreen";

const Group = createNativeStackNavigator();

function GroupStack() {
  return (
    <Group.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GroupList">
      <Group.Screen name="GroupList" component={GroupList} />
      <Group.Screen name="GroupScreen" component={GroupScreen} />
    </Group.Navigator>
  );
}

export default GroupStack;
