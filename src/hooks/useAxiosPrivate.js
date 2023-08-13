import {useEffect, useMemo} from 'react';

import useAuth from './useAuth.js';
import {axiosPrivate} from '../utils/axios.js';

const useAxiosPrivate = () => {
  const {auth} = useAuth();

  // Create a new instance of axiosOpen only when auth changes
  const axiosInstance = useMemo(() => {
    const instance = axiosPrivate;
    instance.interceptors.request.use(config => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${auth?.access}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      response => response,
      async error => {
        // Handle authentication-related errors or refresh token flow here
        return Promise.reject(error);
      },
    );

    return instance;
  }, [auth]);

  useEffect(() => {
    return () => {
      // Eject the interceptors on cleanup
      axiosInstance.interceptors.request.eject();
      axiosInstance.interceptors.response.eject();
    };
  }, [axiosInstance]);

  return axiosInstance;
};

export default useAxiosPrivate;
