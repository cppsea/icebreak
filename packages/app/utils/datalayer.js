import axios from "axios";
import * as SecureStore from "./SecureStore";
import { ENDPOINT } from "./constants";

const server = axios.create({
  baseURL: ENDPOINT,
});

// get user info for local auth only
export async function getUserInfo(token) {
  const user = await server.get("/auth/user", {
    headers: {
      Authorization: token,
    },
  });

  return user.data;
}

export async function logoutUser() {
  await SecureStore.remove("local_auth_token");
}
