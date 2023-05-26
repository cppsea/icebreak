import axios from "axios";
import * as SecureStore from "./SecureStore";
import { ENDPOINT } from "./constants";

const server = axios.create({
  baseURL: ENDPOINT,
});

export async function getUserInfo() {
  const token = await SecureStore.getValueFor("token");
  const user = await server.get("/auth/user", {
    headers: {
      Authorization: token,
    },
  });

  return user.data;
}

export async function logoutUser() {
  await SecureStore.remove("token");
}
