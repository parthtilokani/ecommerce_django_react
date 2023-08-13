import axios from 'axios';
import {baseURL} from './Api.js';

export const axiosOpen = axios.create({
  baseURL: baseURL || '/apiredirect/api',
});

export const axiosPrivate = axios.create({
  baseURL: baseURL || '/apiredirect/api',
});
