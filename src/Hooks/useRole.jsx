import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

function useRole() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure("/get-user-role").then((res) => {
      setRole(res.data.role);
      setLoading(false);
    });
  });
  return { role, loading };
}

export default useRole;
