import {
  Set_Encrypted_AsyncStorage,
  Get_Encrypted_AsyncStorage,
} from 'react-native-encrypted-asyncstorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeUserSession() {
  try {
    await Set_Encrypted_AsyncStorage(type, key, data, encryptionKey);

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
  }
}

export async function storeUserSession() {
  await Get_Encrypted_AsyncStorage(type, key, encryptionKey).then(response => {
    // console.log(response)
    // getting data on response
  });
}

export async function removeValue(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }

  console.log('Done.');
}
