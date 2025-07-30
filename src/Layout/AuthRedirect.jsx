import { Navigate, Outlet } from "react-router-dom";

const AuthRedirect = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthRedirect;
