import axios from 'axios';
import SecureStore from '@expo-secure-store';

const server = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export async function getUserInfo() {
  const token = await SecureStore.getItemAsync("token");
  const user = await server.get('/auth/user', {
    headers: {
      Authorization: token,
    },
  });

  return user.data;
}

export async function logoutUser() {
  await SecureStore.deleteItemAsync();
}
