import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import FeedScreen from "./FeedScreen";
import { useUserContext } from "@app/utils/UserContext";

import Profile from "./feed_tabs/Profile";
import Settings from "./feed_tabs/Settings";

import PropTypes from "prop-types";

import Ionicons from "@expo/vector-icons/Ionicons";

import CreateGroupStack from "./create_group_form/CreateGroupStack";

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
        options={({ navigation }) => ({
          // to hide the feed in the drawer
          drawerLabelStyle: { fontSize: 100 },
          drawerLabel: "Home",
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.drawerButton}
              onPress={() => navigation.openDrawer()}>
              <Ionicons
                name="reorder-three-outline"
                size={32}
                color="#6C6C6C"
              />
            </TouchableOpacity>
          ),
        })}
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
      <Feed.Screen 
        name="Create Group" 
        component={CreateGroupStack} 
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
  drawerButton: {
    marginLeft: 18
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

FeedDrawer.propTypes = {
  navigation: PropTypes.object,
};

export default FeedDrawer;
