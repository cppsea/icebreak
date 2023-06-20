import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { UserProvider, useUserContext } from "@app/utils/UserContext";
import { getUserInfo } from "@app/utils/datalayer";
import * as SecureStore from "@app/utils/SecureStore";
import { ENDPOINT } from "./utils/constants";

import LandingStack from "@app/screens/landing/LandingStack";
import FeedStack from "@app/screens/feed/FeedStack";
import GroupStack from "@app/screens/group/GroupStack";
import ExploreStack from "@app/screens/explore/ExploreStack";
import axios from "axios";

const LINKING_CONFIG = {
  prefixes: ["icebreak://"],
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
    // automatically log in depending on which token is set in expo secure store

    // log in with local auth
    const localAuthToken = await SecureStore.getValueFor("local_auth_token");
    if (localAuthToken) {
      const payload = await getUserInfo(localAuthToken);
      setUser({
        ...user,
        isLoggedIn: true,
        data: payload,
      });
      return;
    }

    // log in with google auth
    const googleAuthToken = await SecureStore.getValueFor("google_auth_token");
    if (googleAuthToken) {
      const body = {
        token: googleAuthToken,
      };
      const { data } = await axios.post(`${ENDPOINT}/auth/google`, body);
      if (data?.success) {
        setUser({
          ...user,
          isLoggedIn: true,
          data: data.payload,
        });
      }
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
