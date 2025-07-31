import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaPlus,
  FaUsers,
  FaClipboardList,
  FaTasks,
  FaTint,
} from "react-icons/fa";
import AuthContext from "../Context/AuthContext";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 h-full w-64 bg-white border-r shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-red-600 mb-6 text-center">
              BloodCare
            </h2>

            <div className="text-center mb-4">
              <div className="text-sm text-gray-600">Logged in as</div>
              <div className="font-semibold text-red-600 capitalize">
                {user?.role}
              </div>
            </div>

            <nav className="flex flex-col gap-3 font-medium">
              <SidebarLink
                to="/dashboard"
                icon={<FaHome />}
                label="Home"
                active={isActive("/dashboard")}
              />
              <SidebarLink
                to="/dashboard/profile"
                icon={<FaUser />}
                label="Profile"
                active={isActive("/dashboard/profile")}
              />

              {user?.role === "donor" && (
                <>
                  <SidebarLink
                    to="/dashboard/my-donation-requests"
                    icon={<FaTint />}
                    label="My Requests"
                    active={isActive("/dashboard/my-donation-requests")}
                  />
                  <SidebarLink
                    to="/dashboard/create-donation-request"
                    icon={<FaPlus />}
                    label="Create Request"
                    active={isActive("/dashboard/create-donation-request")}
                  />
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <SidebarLink
                    to="/dashboard/all-users"
                    icon={<FaUsers />}
                    label="Manage Users"
                    active={isActive("/dashboard/all-users")}
                  />
                  <SidebarLink
                    to="/dashboard/all-blood-donation-request"
                    icon={<FaClipboardList />}
                    label="All Requests"
                    active={isActive("/dashboard/all-blood-donation-request")}
                  />
                </>
              )}

              {user?.role === "volunteer" && (
                <SidebarLink
                  to="/dashboard/assigned-requests"
                  icon={<FaTasks />}
                  label="Assigned Requests"
                  active={isActive("/dashboard/assigned-requests")}
                />
              )}
            </nav>
          </div>

          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="text-red-600 font-semibold hover:text-red-800 flex items-center gap-2 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Topbar */}
        <header className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b shadow-sm z-20">
          <button
            onClick={toggleSidebar}
            className="text-2xl text-gray-700"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1 className="text-xl font-bold text-red-600">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold"
            aria-label="Logout"
          >
            🔓
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Sidebar link component
function SidebarLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all
        ${
          active
            ? "bg-red-100 text-red-700 font-semibold border-l-4 border-red-500"
            : "hover:bg-gray-100"
        }
      `}
    >
      {icon} {label}
    </Link>
  );
}

export default DashboardLayout;
