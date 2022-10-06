import React, { useCallback } from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '@app/components/Screen';
import Button from '@app/components/Button';
import { useUserContext } from '@app/utils/UserContext';
import { logoutUser } from '@app/utils/datalayer';

function FeedScreen() {
  const { user, setUser } = useUserContext();

  const handleOnLogout = useCallback(async () => {
    console.log('logout');
    await logoutUser();
    setUser({
      isLoggedIn: false,
    });
  }, [setUser]);

  const handleGetAllUsers = useCallback(async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://localhost:5050/api/users/', {
      withCredentials: true,
      headers: {
        Authorization: token,
      },
    });
    console.log(response.data);
  }, []);

  return (
    <Screen>
      <Text>Hello, {user.data.firstName}</Text>
      <Image style={styles.avatar} source={{ uri: user.data.avatar }} />
      <Text>{JSON.stringify(user)}</Text>
      <Button onPress={handleOnLogout} title="logout" />
      <Button onPress={handleGetAllUsers} title="get all users" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
});

export default FeedScreen;
