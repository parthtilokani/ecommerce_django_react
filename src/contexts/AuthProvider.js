import {createContext, useState, useEffect} from 'react';
import {axiosOpen} from '../utils/axios.js';
import {
  removeUserSession,
  retrieveUserSession,
  storeUserSession,
} from '../utils/AsyncStorage/userSession.js';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    (async () => {
      try {
        if (await retrieveUserSession('userToken')) {
          let user = JSON?.parse(await retrieveUserSession('userToken'));

          if (!user?.refresh) return;
          const {data} = await axiosOpen.post('/user/token/refresh', {
            refresh: user?.refresh,
          });
          setAuth(prev => ({...prev, access: data?.access}));
          await storeUserSession('userToken', {
            refresh: user?.refresh,
            access: data?.access,
          });
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Handle token refresh error if needed
        // For example, you can log the user out or show an error message
        setAuth({});
        await removeUserSession('userToken');
      }
    })();
  }, []);

  useEffect(() => {
    const twoMinutes = 1000 * 60 * 58;
    let tokenRefreshTimeout;
    const refreshToken = async () => {
      try {
        if (!auth?.refresh) return;
        const {data} = await axiosOpen.post('/user/token/refresh', {
          refresh: auth?.refresh,
        });
        setAuth(prev => ({...prev, access: data?.access}));
        console.log('store token', data?.access);
        await storeUserSession('userToken', {...auth, access: data?.access});
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
  }, [auth?.refresh]);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
