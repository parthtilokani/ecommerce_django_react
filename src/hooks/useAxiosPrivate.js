import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../utils/axios.js";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const { refreshToken } = auth;

  const refresh = async () => {
    try {
      const response = await axiosPrivate.post("/token/refresh", {
        refresh: refreshToken,
      });
      setAuth((prev) => {
        return { ...prev, accessToken: response.data.accessToken };
      });
      localStorage.setItem("auth", {
        ...auth,
        accessToken: response.data.access,
      });
      return response.data.access;
    } catch (error) {
      setAuth({});
      navigate("/signup", { replace: true });
      throw error;
    }
  };
  return refresh;
};

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
