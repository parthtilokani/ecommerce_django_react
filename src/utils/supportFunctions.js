// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneNumberRegex = /^\d{10}$/;

export const isEmptyValue = (value, id, setErrors) => {
  if (!value?.trim()) {
    setErrors(prev => ({...prev, [id]: `${id} is required`}));
    return true;
  }
  setErrors(prev => ({...prev, [id]: ''}));
  return false;
};

export const doesNotMatchRegEx = (value, id, setErrors) => {
  if (!passwordRegex.test(value || '')) {
    setErrors(prev => {
      if (!prev[id])
        return {...prev, [id]: `${id}  must be at least 3 character!`};
      return prev;
    });
    return true;
  }
  setErrors(prev => ({...prev, [id]: ''}));
  return false;
};

export const isValid = (label, value, type) => {
  if (!value?.trim()) return `${label} is required.`;
  if (!type) return '';
  if (type === 'email' && !emailRegex.test(value)) return 'Invalid email.';
  if (type === 'password' && !passwordRegex.test(value))
    return 'Password should contain at least one digit, one lowercase letter, one uppercase letter, and be at least 6 characters long.';
  if (type === 'username' && !usernameRegex.test(value))
    return 'Invalid username.';
  if (type === 'phonenumber' && !phoneNumberRegex.test(value))
    return 'Invalid phone number.';
  return '';
};

import NetInfo from '@react-native-community/netinfo';
import ToastManager, {Toast} from 'toastify-react-native';
import {width} from '../constant/index.js';

export const isConnectedToInternet = async () => {
  return NetInfo.fetch().then(state => {
    if (!state.isConnected) {
      Toast.info('No internet connection!');
    }
    <ToastManager style={{width: width * 0.9}} />;

    return state.isConnected;
  });
};

export function getPostAge(postDate) {
  const postTime = new Date(postDate).getTime();
  const currentTime = Date.now();
  const ageInSeconds = Math.floor((currentTime - postTime) / 1000);

  const timeUnits = [
    {unit: 'year', seconds: 31536000},
    {unit: 'month', seconds: 2592000},
    {unit: 'day', seconds: 86400},
    {unit: 'hour', seconds: 3600},
    {unit: 'minute', seconds: 60},
    {unit: 'second', seconds: 1},
  ];

  for (const {unit, seconds} of timeUnits) {
    if (ageInSeconds >= seconds) {
      const age = Math.floor(ageInSeconds / seconds);
      return `${age} ${unit}${age !== 1 ? 's' : ''} ago`;
    }
  }
}

// const postDate = '2023-07-24T12:35:25.029684Z';
// const postAge = getPostAge(postDate);
// console.log(postAge);
