import {baseURL} from '../Api.js';
import {
  retrieveUserSession,
  storeUserSession,
} from '../AsyncStorage/userSession.js';
import {request} from './request';
import {Alert} from 'react-native';

export const signIN = async values => {
  try {
    const response = await request({
      url: `${baseURL}/token`,
      method: 'POST',
      data: values,
    });
    if (response) {
      await storeUserSession('userToken', {
        refresh: response?.data?.refresh,
        access: response?.data?.access,
      });
      return true;
    }
  } catch (e) {
    console.log('error in login', JSON.stringify(e?.response?.data));
    console.log(e?.response?.data);
    Alert.alert('ALERT!', e?.response?.data?.detail || 'Invalid credentials!');
    return false;
  }
};

export const signUP = async values => {
  try {
    const response = await request({
      url: `${baseURL}/register`,
      method: 'POST',
      data: values,
    });
    if (response) {
      const {name, email, password} = values;

      return true;
      // const signInResponse = await signIN({email, password});
      // return signInResponse;
    }
  } catch (e) {
    console.log('error in signup', JSON.stringify(e?.response));
    Alert.alert('ALERT!', e?.response?.data?.email[0]);
    return false;
  }
};
