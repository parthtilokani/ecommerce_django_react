import axios from 'axios';

import { API } from './API';

export const axiosPrivate = axios.create({
  baseURL: API,
});

export const axiosOpen = axios.create({
  baseURL: API,
});
