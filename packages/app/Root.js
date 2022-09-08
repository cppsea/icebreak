import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider, useUserContext } from '@app/utils/UserContext';

import LandingStack from '@app/screens/landing/LandingStack';
import FeedStack from '@app/screens/feed/FeedStack';

const LINKING_CONFIG = {
  prefixes: ['icebreak://'],
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedStack} />
    </Tab.Navigator>
  );
}

function App() {
  const { user } = useUserContext();

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}>
      {user?.data ? (
        <Stack.Screen name="Tab" component={TabNavigation} />
      ) : (
        <Stack.Screen name="Landing" component={LandingStack} />
      )}
    </Stack.Navigator>
  );
}

function Root() {
  return (
    <UserProvider>
      <NavigationContainer linking={LINKING_CONFIG}>
        <App />
      </NavigationContainer>
    </UserProvider>
  );
}

export default Root;
