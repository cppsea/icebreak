import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GroupProvider } from "@app/utils/GroupContext";
import InitialCreateGroupScreen from "./InitialCreateGroupScreen";
import CreateGroupFormScreen from "./CreateGroupFormScreen1";

const Stack = createNativeStackNavigator();

function CreateGroupStack() {
  return (
    <GroupProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={InitialCreateGroupScreen}>
        <Stack.Screen
          name="Initial Create Group"
          component={InitialCreateGroupScreen}
        />
        <Stack.Screen
          name="Create Group Form"
          component={CreateGroupFormScreen}
        />
      </Stack.Navigator>
    </GroupProvider>
  );
}

export default CreateGroupStack;
