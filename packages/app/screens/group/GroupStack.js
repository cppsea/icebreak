import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GroupScreen from "./GroupScreen";

const Group = createNativeStackNavigator();

function GroupStack() {
  return (
    <Group.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GroupScreen">
      <Group.Screen name="GroupScreen" component={GroupScreen} />
    </Group.Navigator>
  );
}

export default GroupStack;
