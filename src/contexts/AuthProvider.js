import {createContext, useState, useEffect} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    (async () => {
      const userToken = await retrieveUserSession('userToken');
      if (userToken) setAuth({...JSON.parse(userToken)});
    })();
  }, []);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
