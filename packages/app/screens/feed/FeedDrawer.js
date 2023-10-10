import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { StyleSheet, View, Text, Image } from "react-native";
import FeedScreen from "./FeedScreen";
import { useUserContext } from "@app/utils/UserContext";

import Profile from "./feed_tabs/Profile";
import Settings from "./feed_tabs/Settings";

const Feed = createDrawerNavigator();

const DARK_BLUE = "darkblue";
const GRAY = "grey";

function FeedDrawer() {
  return (
    <Feed.Navigator
      testID="navigation-drawer"
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Feed.Screen
        testID="navigation-drawer-item"
        name="Feed"
        component={FeedScreen}
        options={{
          drawerLabelStyle: { fontSize: 100 },
          drawerLabel: "Home",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Feed.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Feed.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
    </Feed.Navigator>
  );
}

function CustomDrawerContent(props) {
  // eslint-disable-next-line no-unused-vars
  const { user, setUser } = useUserContext();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image style={styles.avatar} source={{ uri: user.data.avatar }} />
        <Text style={styles.drawerDisplayName}>
          {user.data.firstName} {user.data.lastName}
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    height: 40,
    width: 40,
  },
  drawerDisplayName: {
    color: DARK_BLUE,
    fontSize: 20,
    marginTop: 10,
  },
  drawerHeader: {
    borderBottomColor: GRAY,
    borderBottomWidth: 2,
    justifyContent: "space-between",
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 15,
  },
});

export default FeedDrawer;
