import axios from 'axios';
// import Config from 'react-native-config';

export const request = ({url, method, data, headers}) => {
  return axios({
    method: method || 'get',
    url: url,
    data: data,
    // headers: {
    // 'Content-Type': 'multipart/form-data',
    // Accept: 'application/json',
    // },
  });
};

// export const addAccessTokenToAxios = async token => {
//   axios.defaults.headers.Authorization = token;
// };

// const API = Config.API_URL;

// export const axiosSetup = async () => {
//   const token = await AsyncStorage.getItem('auth_token');
//   console.log('sadjaksdjaksdha ', token);
//   axios.defaults.baseURL = API;
//   axios.defaults.withCredentials = true;
//   axios.defaults.headers.Authorization = token;
// };

// import React, {useState, useEffect} from 'react';
// import axios from 'axios';
