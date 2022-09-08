import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-community/async-storage';

import { Text, Image, StyleSheet } from 'react-native';
import Screen from '@app/components/Screen';
import Button from '@app/components/Button';
import { useUserContext } from '@app/utils/UserContext';

function FeedScreen() {
  const { user, setUser } = useUserContext();
  const [currentUser, setCurrentUser] = useState({});

  const getUserInfo = async () => {
    const response = await axios.get(
      `http://localhost:5050/api/users/${user?.data?.user_id}`,
      {
        withCredentials: true,
      },
    );
    setCurrentUser(response.data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleOnLogout = useCallback(async () => {
    console.log('logout');
    const response = await axios.get('http://localhost:5050/api/auth/logout');
    console.log('@@logout', response.data);
    setUser({
      userLoggedIn: false,
    });
  }, [setUser]);

  const handleGetAllUsers = useCallback(async () => {
    const cookie = await AsyncStorage.getItem('cookie');
    const response = await axios.get('http://localhost:5050/api/users/', {
      withCredentials: true,
      headers: {
        cookie,
      },
    });
    console.log(response.data);
  }, []);

  const handleLogCookies = useCallback(async () => {
    console.log(await CookieManager.getAll());
    const response = await axios.post(
      'http://localhost:5050/api/users/test',
      {
        body: {
          dank: 'urmom',
        },
      },
      {
        withCredentials: true,
      },
    );
    console.log(response.data);
  }, []);

  return (
    <Screen>
      <Text>Hello, {currentUser.first_name}</Text>
      <Image style={styles.avatar} source={{ uri: currentUser.avatar }} />
      <Text>{JSON.stringify(currentUser)}</Text>
      <Button onPress={handleOnLogout} title="logout" />
      <Button onPress={handleGetAllUsers} title="get all users" />
      <Button onPress={handleLogCookies} title="log cookies" />
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
