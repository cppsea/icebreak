import React, { useCallback } from 'react';
import { Linking, Text } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import Button from '@app/components/Button';
import Screen from '@app/components/Screen';

import { useUserContext } from '@app/utils/UserContext';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserInfo } from '@app/utils/datalayer';

function LandingScreen() {
  // const navigation = useNavigation();
  const { user, setUser } = useUserContext();

  const handleOnLoginWithGoogle = useCallback(async () => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(
          'http://localhost:5050/api/auth/google',
          'icebreak://',
          {
            // iOS Properties
            ephemeralWebSession: false,
            // Android Properties
            showTitle: false,
            enableUrlBarHiding: true,
            enableDefaultShare: false,
          },
        );

        const [, token] = result.url.match(/token=([^#]+)/);

        await AsyncStorage.setItem('token', token);
        const payload = await getUserInfo();

        setUser({
          ...user,
          isLoggedIn: true,
          data: payload,
        });
        Linking.openURL(result.url);
      } else {
        Linking.openURL('http://localhost:5050/api/auth/google');
      }
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
