import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import LoadingSpinner from "../Components/Shared/LoadingSpinner";
import useUserRole from "./../Hooks/useUserRole";
import AuthContext from "./../Context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default AdminRoute;
