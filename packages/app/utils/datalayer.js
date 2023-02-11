import axios from 'axios';
import Keychain from '@react-native-keychain';

const server = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export async function getUserInfo() {
  const token = await Keychain.getGenericPassword();
  const user = await server.get('/auth/user', {
    headers: {
      Authorization: token,
    },
  });

  return user.data;
}

export async function logoutUser() {
  await Keychain.resetGenericPassword();
}
