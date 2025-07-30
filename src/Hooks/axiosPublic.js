import axios from "axios";

const useAxiosPublic = () => {
  const instance = axios.create({
    baseURL: "https://pulse-point-server-blue.vercel.app/",
  });

  return instance;
};

export default useAxiosPublic;
