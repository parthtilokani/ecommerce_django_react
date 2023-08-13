// import {
//   Set_Encrypted_AsyncStorage,
//   Get_Encrypted_AsyncStorage,
// } from 'react-native-encrypted-asyncstorage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export async function storeUserSession() {
//   try {
//     await Set_Encrypted_AsyncStorage((type = 'text'), key, data, encryptionKey);

//     // Congrats! You've just stored your first value!
//   } catch (error) {
//     // There was an error on the native side
//   }
// }

// export async function getUserSession() {
//   await Get_Encrypted_AsyncStorage(type, key, encryptionKey).then(response => {
//     // console.log(response)
//     // getting data on response
//   });
// }

// export async function removeValue(key) {
//   try {
//     await AsyncStorage.removeItem(key);
//   } catch (e) {
//     // remove error
//   }

//   console.log('Done.');
// }

import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeUserSession(key, data) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(data));

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
  }
}

export async function retrieveUserSession(key) {
  try {
    const session = await EncryptedStorage.getItem(key);
    if (session !== undefined) {
      return session;
    } else {
      return undefined;
    }
  } catch (error) {
    return 'Something went wrong';
    // There was an error on the native side
  }
}

export async function removeUserSession(key) {
  try {
    await EncryptedStorage.removeItem(key);
    // Congrats! You've just removed your first value!
  } catch (error) {
    // There was an error on the native side
  }
}

export async function clearStorage() {
  try {
    await EncryptedStorage.clear();
    // Congrats! You've just cleared the device storage!
  } catch (error) {
    // There was an error on the native side
  }
}
