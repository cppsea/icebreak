import React, { useCallback, useEffect } from 'react';
import { Linking, Text } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import CookieManager from '@react-native-cookies/cookies';

import Button from '@app/components/Button';
import Screen from '@app/components/Screen';

import { useUserContext } from '@app/utils/UserContext';

function LandingScreen() {
  // const navigation = useNavigation();
  const { user, setUser } = useUserContext();

  const handleOnLoginWithGoogle = useCallback(async () => {
    // Linking.openURL('http://localhost:5050/api/auth/google');
    try {
      await CookieManager.clearAll();
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

        console.log(result);
        Linking.openURL(result.url);
        const [, payload] = result.url.match(/user=([^#]+)/);

        const normalizedPayload = JSON.parse(decodeURIComponent(payload));
        console.log(normalizedPayload);
        setUser({
          ...user,
          data: normalizedPayload,
        });
        console.log(await CookieManager.getAll());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    Linking.addEventListener('url', ({ url }) => {
      console.log(url);
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [user, setUser]);

  return (
    <Screen>
      <Text>icebreak</Text>
      <Button onPress={handleOnLoginWithGoogle} title="login with google" />
    </Screen>
  );
}

export default LandingScreen;
