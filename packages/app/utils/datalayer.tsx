import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const server = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export async function getUserInfo() {
  const token = await AsyncStorage.getItem('token') ?? "";
  // Defaults to empty string instead of null to be compatible with types
  const user = await server.get('/auth/user', {
    headers: {
      Authorization: token,
    },
  });

  return user.data;
}

export async function logoutUser() {
  await AsyncStorage.removeItem('token');
}
