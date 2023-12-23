import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import FeedScreen from "./FeedScreen";
import { useUserContext } from "@app/utils/UserContext";

import Profile from "./feed_tabs/Profile";
import Settings from "./feed_tabs/Settings";

import Ionicons from "@expo/vector-icons/Ionicons";
import { FeedStackParamList } from "@app/types/Feed";

const Feed = createDrawerNavigator<FeedStackParamList>();

const DARK_BLUE = "darkblue";
const GRAY = "grey";

function FeedDrawer() {
  return (
    <Feed.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Feed.Screen
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
    </Feed.Navigator>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useUserContext();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image style={styles.avatar} source={{ uri: user.data?.avatar }} />
        <Text style={styles.drawerDisplayName}>
          {user.data?.firstName} {user.data?.lastName}
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
    marginLeft: 18,
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
