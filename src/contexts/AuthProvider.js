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
    const refreshToken = async () => {
      try {
        if (!auth?.refreshToken) return;
        const { data } = await axiosOpen.post("/user/token/refresh", {
          refresh: auth.refreshToken,
        });
        setAuth((prev) => ({ ...prev, accessToken: data?.access }));
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, accessToken: data?.access })
        );
      } catch (error) {
        console.error("Error refreshing token:", error);
        setAuth({});
        localStorage.removeItem("auth");
      }
    };
    refreshToken();
  }, []);

  useEffect(() => {
    const timeInMiliSeconds = 1000 * 60 * 58;
    let tokenRefreshTimeout;

    const refreshToken = async () => {
      try {
        if (!auth?.refreshToken) return;
        const { data } = await axiosOpen.post("/user/token/refresh", {
          refresh: auth.refreshToken,
        });
        setAuth((prev) => ({ ...prev, accessToken: data?.access }));
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, accessToken: data?.access })
        );
        scheduleTokenRefresh();
      } catch (error) {
        console.error("Error refreshing token:", error);
        setAuth({});
        localStorage.removeItem("auth");
      }
    };

    const scheduleTokenRefresh = () => {
      clearTimeout(tokenRefreshTimeout);
      tokenRefreshTimeout = setTimeout(refreshToken, timeInMiliSeconds);
    };

    scheduleTokenRefresh();

    return () => clearTimeout(tokenRefreshTimeout);
  }, [auth?.refreshToken]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
