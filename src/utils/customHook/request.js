import axios from 'axios';
import {retrieveUserSession} from '../AsyncStorage/userSession.js';
import useAxiosPrivate from '../../hooks/useAxiosPrivate.js';

export const request = async ({url, method, data, headers}) => {
  return axios({
    method: method || 'get',
    url: url,
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getRequest = async ({url, params}) => {
  return axios.get(url);
};

// export const axiosSetup = async () => {
//   const token = await retrieveUserSession('userToken');
//   axios.defaults.withCredentials = true;
//   axios.defaults.headers.Authorization = 'Bearer ' + token?.access;
// };

// export const getPrivateRequest = (method, url, data, headers) => {
//   const axiosPrivate = useAxiosPrivate();
//   return axiosPrivate({
//     method,
//     url,
//     data,
//     headers,
//   });
// };
