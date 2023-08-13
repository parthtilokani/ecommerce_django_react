import { createContext, useState, useEffect } from 'react';

import { axiosOpen } from '../utils/axios';

const AuthContext = createContext({});

export default AuthContext;

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem('auth') ? { ...JSON.parse(localStorage.getItem('auth')) } : {});

  useEffect(() => {
    (async () => {
      try {
        if (!auth?.refreshToken) return;
        const { data } = await axiosOpen.post('/user/token/refresh', {
          refresh: auth.refreshToken,
        });
        setAuth((prev) => ({ ...prev, accessToken: data?.access }));
        localStorage.setItem('auth', JSON.stringify({ ...auth, accessToken: data?.access }));
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Handle token refresh error if needed
        // For example, you can log the user out or show an error message
        setAuth({});
        localStorage.removeItem('auth');
      }
    })();
  }, []);

  useEffect(() => {
    const twoMinutes = 1000 * 60 * 29;
    let tokenRefreshTimeout;

    const refreshToken = async () => {
      try {
        if (!auth?.refreshToken) return;
        const { data } = await axiosOpen.post('/user/token/refresh', {
          refresh: auth.refreshToken,
        });
        setAuth((prev) => ({ ...prev, accessToken: data?.access }));
        localStorage.setItem('auth', JSON.stringify({ ...auth, accessToken: data?.access }));
        scheduleTokenRefresh();
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Handle token refresh error if needed
        // For example, you can log the user out or show an error message
      }
    };

    const scheduleTokenRefresh = () => {
      clearTimeout(tokenRefreshTimeout);
      tokenRefreshTimeout = setTimeout(refreshToken, twoMinutes);
    };

    scheduleTokenRefresh();

    return () => clearTimeout(tokenRefreshTimeout);
  }, [auth?.refreshToken]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};
