import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GuildList from "./GuildList";
import GroupScreen from "./GroupScreen";
import EventOverviewScreen from "./event_overview/EventOverviewScreen";
import EventsCreationScreen from "./tabs/events/EventsCreationScreen";

const Group = createNativeStackNavigator();

function GroupStack() {
  return (
    <Group.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GuildList">
      <Group.Screen name="GuildList" component={GuildList} />
      <Group.Screen name="GroupScreen" component={GroupScreen} />
      <Group.Screen
        name="EventOverviewScreen"
        component={EventOverviewScreen}
      />
      <Group.Screen
        name="EventsCreationScreen"
        component={EventsCreationScreen}
      />
    </Group.Navigator>
  );
}

export default GroupStack;
