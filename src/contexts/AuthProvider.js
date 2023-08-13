import {createContext, useState, useEffect} from 'react';
import {axiosOpen} from '../utils/axios.js';
import {retrieveUserSession} from '../utils/AsyncStorage/userSession.js';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({});

  // useEffect(() => {
  //   (async () => {
  //     const userToken = await retrieveUserSession('userToken');
  //     if (userToken) setAuth({...JSON.parse(userToken)});
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      if (auth.refresh) return;
      const userToken = await retrieveUserSession('userToken');
      if (userToken) setAuth({...JSON.parse(userToken)});
    })();
    let twoMinutes = 1000 * 60 * 2;

    let interval = setInterval(() => {
      if (auth?.refresh) {
        axiosOpen
          .post('/user/token/refresh', {refresh: auth?.refresh})
          .then(({data}) => {
            setAuth(prev => ({...prev, access: data?.access}));
          });
      }
    }, twoMinutes);
    return () => clearInterval(interval);
  }, [auth]);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
