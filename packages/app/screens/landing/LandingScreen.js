import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import { Text } from 'react-native';
import * as WebBroswer from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import EventCard from '@app/components/EventCard/EventCard';

import { useUserContext } from '@app/utils/UserContext';
import { getUserInfo } from '@app/utils/datalayer';
import { ENDPOINT } from '@app/utils/constants';

WebBroswer.maybeCompleteAuthSession();

function LandingScreen() {
  const { user, setUser } = useUserContext();

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: 'id_token',
    expoClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
    iosClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
    androidClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
    webClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
  });

  const handleOnLoginWithGoogle = useCallback(async () => {
    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        throw new Error("Failed to authenticate with Google's OAuth");
      }

      const id_token = result.params.id_token;

      const body = {
        token: id_token
      };

      const { data } = await axios.post(`${ENDPOINT}/auth/google`, body);
      if (data?.success) {
        setUser({
          ...user,
          isLoggedIn: true,
          data: data.payload
        }); 
      }
    } catch(error) {
      console.log(error.message);
    }
  }, [user, setUser, request]);

  return (
    <Screen>
      <Text>icebreak</Text>
      <Text>Login</Text>
      <Button
        disabled={!request}
        onPress={handleOnLoginWithGoogle}
        title="login with google"
      />
      <EventCard 
        banner={require("@app/components/EventCard/eventcard_test/test_card_banner.png")}
        timeBegin="11:00AM" timeEnd="12:00PM"
        title="College Survival Guide"
        location="BLDG 8 @ Cal Poly Pomona"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
    </Screen>
  );
}

export default LandingScreen;