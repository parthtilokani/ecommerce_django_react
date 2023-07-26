import { createContext, useState, useEffect } from "react";
import { axiosOpen } from "../utils/axios.js";

const AuthContext = createContext({});

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    localStorage.getItem("auth")
      ? { ...JSON.parse(localStorage.getItem("auth")) }
      : {}
  );
  useEffect(() => {
    let twoMinutes = 1000 * 60 * 2;

    let interval = setInterval(() => {
      if (auth?.refreshToken) {
        console.log("Found Auth");
        axiosOpen
          .post("/user/token/refresh", { refresh: auth?.refreshToken })
          .then(({ data }) => {
            setAuth((prev) => ({ ...prev, accessToken: data?.access }));
          });
      }
    }, twoMinutes);
    return () => clearInterval(interval);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
