import axios from 'axios';
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
      return true;
    }
  } catch (e) {
    console.log('error in signup', JSON.stringify(e?.response));
    Alert.alert('ALERT!', e?.response?.data?.email[0]);
    return false;
  }
};
export const requestOtp = async values => {
  try {
    const response = await axios.get(`${baseURL}/otp`, {
      params: {
        phone: values.phone,
      },
    });

    return await response?.data?.OTP;
  } catch (e) {
    Alert.alert('ALERT!', e?.response?.data?.detail || 'Failed to send OTP!');
    return false;
  }
};
export const verifyOtp = async values => {
  try {
    const response = request({
      url: `${baseURL}/otp`,
      method: 'POST',
      data: values,
    });

    return true;
    // return await response?.data?.OTP;
  } catch (e) {
    Alert.alert(
      'ALERT!',
      e?.response?.data?.detail || 'OPT verification faild!',
    );
    return false;
  }
};
