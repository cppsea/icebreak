import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { Text } from "react-native";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import Button from "@app/components/Button";
import Screen from "@app/components/Screen";

import { useUserContext } from "@app/utils/UserContext";
import { getUserInfo } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";
import * as SecureStore from "@app/utils/SecureStore";

WebBrowser.maybeCompleteAuthSession();

function LandingScreen() {
  const { user, setUser } = useUserContext();

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: "id_token",
    expoClientId: Constants.expoConfig.extra.expoClientId,
    iosClientId: Constants.expoConfig.extra.iosClientId,
    androidClientId: Constants.expoConfig.extra.androidClientId,
    webClientId: Constants.expoConfig.extra.webClientId,
  });

  const handleOnLoginWithGoogle = useCallback(async () => {
    try {
      const result = await promptAsync();

      if (result.type !== "success") {
        throw new Error("Failed to authenticate with Google's OAuth");
      }

      const idToken = result.params.id_token;

      const body = {
        token: idToken,
      };

      const { data: response } = await axios.post(
        `${ENDPOINT}/auth/google`,
        body
      );
      if (response.status === "success") {
        SecureStore.save("token", response.data.accessToken);
        SecureStore.save("refreshToken", response.data.refreshToken);
        setUser({
          ...user,
          isLoggedIn: true,
          data: response.data.user,
        });
      }
    } catch (error) {
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
    </Screen>
  );
}

export default LandingScreen;
