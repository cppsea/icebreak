import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { ENDPOINT } from "@app/utils/constants";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";

export async function useGoogleLogin(user, setUser) {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.idToken;

    const body = {
      token: idToken,
    };

    const { data: response } = await axios.post(
      `${ENDPOINT}/auth/google`,
      body
    );

    if (response?.status == "success") {
      await SecureStore.save("accessToken", response.data.accessToken);
      await SecureStore.save("refreshToken", response.data.refreshToken);

      setUser({
        ...user,
        isLoggedIn: true,
        data: response.data.user,
      });
    }
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("Google Error: User cancelled the login flow");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(
        "Google Error: Operation (e.g. sign in) is in progress already"
      );
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log("Google Error: Play services not available or outdated");
    } else {
      console.log(error);
    }
  }
}
