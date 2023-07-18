Root.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserProvider, useUserContext } from '@app/utils/UserContext';
import { getUserInfo } from '@app/utils/datalayer';

import LandingStack from '@app/screens/landing/LandingStack';
import FeedStack from '@app/screens/feed/FeedStack';
import GroupStack from '@app/screens/group/GroupStack';
import ExploreStack from '@app/screens/explore/ExploreStack';
import OnboardingStack from '@app/screens/onboarding/OnboardingStack';

const LINKING_CONFIG = {
  prefixes: ['icebreak://'],
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Explore" component={ExploreStack} />
      <Tab.Screen name="Orgs" component={GroupStack} />
    </Tab.Navigator>
  );
}

function App() {
  const { user, setUser } = useUserContext();
  const [isFirstTime, setIsFirstTime] = useState(null);

  const currentSession = async () => {
    const token = await AsyncStorage.getItem('token');
    const isFirstTime = await AsyncStorage.getItem('isFirstTime');
    setIsFirstTime(isFirstTime === null ? true : JSON.parse(isFirstTime));
    if (token) {
      const payload = await getUserInfo();
      setUser({
        ...user,
        isLoggedIn: true,
        data: payload,
      });
    }
  };

  useEffect(() => {
    currentSession();
  }, []);

  // Check if isFirstTime is not null
  if (isFirstTime === null) {
    return <View />;
  }

  return (
    <Stack.Navigator
  initialRouteName="Landing"
  screenOptions={{ headerShown: false }}
    >
  {!user?.isLoggedIn ? (
        <Stack.Screen name="Landing" component={LandingStack} />
      ) : (
        <>
          {/* This always sends the user to the onboarding screen upon logging in for testing purposes */}
          <Stack.Screen name="Onboarding" component={OnboardingStack} /> 
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
        </>
      )}
    </Stack.Navigator>


  );
}


function Root() {
  return (
    <UserProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </UserProvider>
  );
}

export default Root;
