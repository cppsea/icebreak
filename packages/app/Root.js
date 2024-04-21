import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider, useUserContext } from "@app/utils/UserContext";
import { getUserInfo } from "@app/utils/datalayer";
import * as SecureStore from "@app/utils/SecureStore";
import { ENDPOINT } from "./utils/constants";

import LandingStack from "@app/screens/landing/LandingStack";
import FeedStack from "@app/screens/feed/FeedStack";
import GroupStack from "@app/screens/group/GroupStack";
import ExploreStack from "@app/screens/explore/ExploreStack";
import axios from "axios";

import { logoutUser } from "@app/utils/datalayer";

import Constants from "expo-constants";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import { GoogleSignin } from "@react-native-google-signin/google-signin";

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

  const currentSession = async () => {
    let accessToken = await SecureStore.getValueFor("accessToken");

    if (!accessToken) {
      return;
    }

    try {
      const userResponse = await getUserInfo(accessToken);

      if (userResponse.status === "success") {
        setUser({
          ...user,
          isLoggedIn: true,
          data: userResponse.data.user,
        });
        return;
      }
    } catch (err) {
      await logoutUser();
      console.log(
        "Something went wrong trying to auto log in with stored access token"
      );
    }

    if (!refreshToken) {
      return;
    }

    // If access token is invalid/expired, try to get a new one with the refresh token
    const refreshToken = await SecureStore.getValueFor("refreshToken");
    try {
      const { data: response } = await axios.post(`${ENDPOINT}/auth/token`, {
        refreshToken: refreshToken,
      });

      await SecureStore.save("accessToken", response.data.accessToken);
      await SecureStore.save("refreshToken", response.data.refreshToken);

      const userResponse = await getUserInfo(response.data.accessToken);

      if (userResponse.status === "success") {
        setUser({
          ...user,
          isLoggedIn: true,
          data: userResponse.data.user,
        });
        return;
      }
    } catch (err) {
      await logoutUser();
      console.log(
        "Something went wrong trying to auto log in with newly fetched access token from stored refresh token"
      );
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Constants.expoConfig.extra.webClientId,
      iosClientId: Constants.expoConfig.extra.iosClientId,
    });

    currentSession();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{ headerShown: false }}>
      {user?.isLoggedIn ? (
        <Stack.Screen name="Tab" component={TabNavigation} />
      ) : (
        <Stack.Screen name="Landing" component={LandingStack} />
      )}
    </Stack.Navigator>
  );
}

function Root() {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

export default Root;
