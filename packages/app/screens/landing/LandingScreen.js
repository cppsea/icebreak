import React, { useCallback } from 'react';
import { Linking, Text } from 'react-native';
import * as WebBroswer from 'expo-web-browser';

import Button from '@app/components/Button';
import Screen from '@app/components/Screen';

import { useUserContext } from '@app/utils/UserContext';
import { getUserInfo } from '@app/utils/datalayer';
import { ENDPOINT } from '@app/utils/constants';

function LandingScreen() {
  // const navigation = useNavigation();
  const { user, setUser } = useUserContext();

  const handleOnLoginWithGoogle = useCallback(async () => {
    try {
      //   const result = await InAppBrowser.openAuth(
      //     'http://localhost:5050/api/auth/google',
      //     'icebreak://',
      //     {
      //       // iOS Properties
      //       ephemeralWebSession: false,
      //       // Android Properties
      //       showTitle: false,
      //       enableUrlBarHiding: true,
      //       enableDefaultShare: false,
      //     },
      //   );

      //   const [, token] = result.url.match(/token=([^#]+)/);

      //   await AsyncStorage.setItem('token', token);
      //   const payload = await getUserInfo();

      //   setUser({
      //     ...user,
      //     isLoggedIn: true,
      //     data: payload,
      //   });
      //   Linking.openURL(result.url);
      const result = await WebBroswer.openAuthSessionAsync(`${ENDPOINT}/auth/google`, "icebreak://");
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }, [user, setUser]);

  return (
    <Screen>
      <Text>icebreak</Text>
      <Button onPress={handleOnLoginWithGoogle} title="login with google" />
    </Screen>
  );
}

export default LandingScreen;
