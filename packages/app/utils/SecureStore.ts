import * as SecureStore from "expo-secure-store";

export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export async function remove(key: string) {
  await SecureStore.deleteItemAsync(key);
}
