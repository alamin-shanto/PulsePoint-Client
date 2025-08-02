import axios from "axios";
import { useContext, useEffect, useMemo } from "react";
import AuthContext from "../Context/AuthContext";

const useAxiosSecure = () => {
  const { logout } = useContext(AuthContext);

  // Create axios instance only once
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: "https://pulse-point-server-blue.vercel.app/",
    });
  }, []);

  useEffect(() => {
    // Add interceptors after instance is created
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
  }, [logout, axiosInstance]);

  return axiosInstance;
};

export default useAxiosSecure;
