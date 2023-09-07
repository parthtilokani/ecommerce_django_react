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
        setAuth((prev) => ({ ...prev, accessToken: data?.access, refreshToken: data?.refresh }));
        localStorage.setItem(
          'auth',
          JSON.stringify({ ...auth, accessToken: data?.access, refreshToken: data?.refresh })
        );
      } catch (error) {
        console.error('Error refreshing token:', error);
        setAuth({});
        localStorage.removeItem('auth');
      }
    })();
  }, []);

  useEffect(() => {
    const twoMinutes = 1000 * 60 * 58;
    let tokenRefreshTimeout;

    const refreshToken = async () => {
      try {
        if (!auth?.refreshToken) return;
        const { data } = await axiosOpen.post('/user/token/refresh', {
          refresh: auth.refreshToken,
        });
        setAuth((prev) => ({ ...prev, accessToken: data?.access, refreshToken: data?.refresh }));
        localStorage.setItem(
          'auth',
          JSON.stringify({ ...auth, accessToken: data?.access, refreshToken: data?.refresh })
        );
        scheduleTokenRefresh();
      } catch (error) {
        console.error('Error refreshing token:', error);
        setAuth({});
        localStorage.removeItem('auth');
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
