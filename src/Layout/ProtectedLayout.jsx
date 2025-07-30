import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./DashBoardLayout";

const isAuthenticated = () => !!localStorage.getItem("backendJwt");

const ProtectedLayout = () => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* DashboardLayout already has the sidebar and main content */}
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default ProtectedLayout;
