import axios from 'axios';
import {baseURL} from '../Api.js';
import {storeUserSession} from '../AsyncStorage/userSession.js';
import {request} from './request';
import {Alert} from 'react-native';
import useAuth from '../../hooks/useAuth.js';

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
    if (!e?.response) {
      Alert.alert('ALERT!', 'No internet connection!');
      return false;
    }
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
      console.log(response);
      return true;
    }
  } catch (e) {
    console.log('error in signup', JSON.stringify(e));
    if (!e?.response) {
      Alert.alert('ALERT!', 'No internet connection!');
      return false;
    }

    Alert.alert('ALERT!', e?.response?.data?.email[0]);
    //  e?.response?.data?.email[0]
    return false;
  }
};

export const requestOtp = async values => {
  try {
    const response = await axios.get(`${baseURL}/otp`, {
      params: {
        phone: values.phone_no,
      },
    });
    if (response?.data?.Status === 'Success') return true;

    return false;
  } catch (e) {
    console.log(e?.response?.data);
    Alert.alert('ALERT!', e?.response?.data?.detail || 'Failed to send OTP!');
    return false;
  }
};

export const verifyOtp = async (values, url) => {
  try {
    const response = await request({
      url: `${baseURL}/${url}`,
      method: 'POST',
      data: values,
    });
    if (response || url === 'token/withotp') {
      await storeUserSession('userToken', {
        refresh: response?.data?.refresh,
        access: response?.data?.access,
      });
      return true;
    }
    return false;
  } catch (e) {
    console.log(e?.response?.data);
    Alert.alert(
      'ALERT!',
      e?.response?.data?.detail || 'OPT verification faild!',
    );
    return false;
  }
};
