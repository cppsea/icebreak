import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { StyleSheet, View, Text, Image } from 'react-native';
import FeedScreen from './FeedScreen';
import { useUserContext } from '@app/utils/UserContext';
import Button from '@app/components/Button';
import CreateGroupStack from './create group form/CreateGroupStack';

const Feed = createDrawerNavigator();

function FeedDrawer(props) {
  return (
    <Feed.Navigator testID="navigation-drawer"
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Feed.Screen 
        testID="navigation-drawer-item"
        name="Feed" 
        component={FeedScreen} 
        options={{ 
          drawerLabelStyle: {fontSize: 100},
          drawerLabel: 'Home',
          drawerItemStyle: {display: "none"}
        }}
      />
      <Feed.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          headerShown: false
        }}
      />
      <Feed.Screen 
        name="Settings" 
        component={Settings} 
        options={{
          headerShown: false
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
  )
}

function CustomDrawerContent(props) {
  const { user, setUser } = useUserContext();
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image style={styles.avatar} source={{ uri: user.data.avatar }} />
        <Text style={styles.drawerDisplayName}>{user.data.firstName} {user.data.lastName}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Placeholder profile screen
function Profile( {navigation} ) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        onPress={() => navigation.navigate('Feed')}
        title='Back'
      />
      <Text>Profile Screen</Text>
    </View>
  );
}

// Placeholder settings screen
function Settings( {navigation} ) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        onPress={() => navigation.navigate('Feed')}
        title='Back'
      />
      <Text>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  drawerHeader: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15,
    paddingBottom: 15,
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  drawerDisplayName:{
    fontSize: 20,
    color: 'darkblue',
    marginTop: 10,
  }
});

export default FeedDrawer;
