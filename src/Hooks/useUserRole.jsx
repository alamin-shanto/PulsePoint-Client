import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import { useContext } from "react";
import AuthContext from "./../Context/AuthContext";

const useUserRole = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: role = null, isLoading: roleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data?.role;
    },
    enabled: !!user?.email,
  });

  return { role, roleLoading };
};

export default useUserRole;
