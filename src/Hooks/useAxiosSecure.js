import axios from "axios";
import { useContext, useEffect, useMemo } from "react";
import AuthContext from "../Context/AuthContext";

const useAxiosSecure = () => {
  const { user, logout } = useContext(AuthContext);

  // Create axios instance only once
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://pulse-point-server-blue.vercel.app/",
    });
    return instance;
  }, []);

  useEffect(() => {
    // Add interceptors after instance is created
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        } else {
          delete config.headers.Authorization;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Cleanup interceptors on unmount or dependencies change
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user?.accessToken, logout, axiosInstance]);

  return axiosInstance;
};

export default useAxiosSecure;
