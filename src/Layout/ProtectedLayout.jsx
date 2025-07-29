import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./DashBoardLayout";

const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedLayout = () => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedLayout;
