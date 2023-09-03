import axios from "axios";
import * as SecureStore from "./SecureStore";
import { ENDPOINT } from "./constants";

const server = axios.create({
  baseURL: ENDPOINT,
});

// get user info for local auth only
export async function getUserInfo(token) {
  const { data: response } = await server.get("/auth/user", {
    headers: {
      Authorization: token,
    },
  });

  return response.data.user;
}

export async function logoutUser() {
  await SecureStore.remove("accessToken");
  await SecureStore.remove("refreshToken");
}
