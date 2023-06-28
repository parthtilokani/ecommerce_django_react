import axios from 'axios';

export const request = async ({url, method, data, headers}) => {
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
