import * as SecureStore from 'expo-secure-store';

export async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}
  
export async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    return result;
}

export async function remove(){
    await SecureStore.deleteItemAsync();
}