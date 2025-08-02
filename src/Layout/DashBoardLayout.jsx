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
    <div className="flex min-h-screen bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 h-full w-64 bg-white border-r border-pink-300 shadow-2xl transform transition-transform duration-300 ease-in-out rounded-tr-3xl rounded-br-3xl
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <Link
              to="/"
              className="text-3xl font-extrabold text-pink-600 mb-8 text-center tracking-wide drop-shadow-md hover:text-pink-800 transition-colors"
            >
              Pulse Point
            </Link>

            <div className="text-center mb-8">
              <div className="text-sm text-pink-400 uppercase tracking-widest font-semibold">
                Logged in as
              </div>
              <div className="mt-1 text-pink-700 font-bold text-lg capitalize drop-shadow-sm">
                {user?.role || "User"}
              </div>
            </div>

            <nav className="flex flex-col gap-4 font-semibold">
              <SidebarLink
                to="/dashboard"
                icon={<FaHome className="text-pink-500" />}
                label="Home"
                active={isActive("/dashboard")}
              />
              <SidebarLink
                to="/dashboard/profile"
                icon={<FaUser className="text-pink-500" />}
                label="Profile"
                active={isActive("/dashboard/profile")}
              />

              {/* Donor Routes */}
              {user?.role === "donor" && (
                <>
                  <SidebarLink
                    to="/dashboard/my-donation-requests"
                    icon={<FaTint className="text-pink-500" />}
                    label="My Requests"
                    active={isActive("/dashboard/my-donation-requests")}
                  />
                  <SidebarLink
                    to="/dashboard/create-donation-request"
                    icon={<FaPlus className="text-pink-500" />}
                    label="Create Request"
                    active={isActive("/dashboard/create-donation-request")}
                  />
                </>
              )}

              {/* Admin Routes */}
              {user?.role === "admin" && (
                <>
                  <SidebarLink
                    to="/dashboard/all-users"
                    icon={<FaUsers className="text-pink-500" />}
                    label="Manage Users"
                    active={isActive("/dashboard/all-users")}
                  />
                  <SidebarLink
                    to="/dashboard/all-blood-donation-request"
                    icon={<FaClipboardList className="text-pink-500" />}
                    label="All Requests"
                    active={isActive("/dashboard/all-blood-donation-request")}
                  />
                </>
              )}

              {/* Volunteer Routes */}
              {user?.role === "volunteer" && (
                <SidebarLink
                  to="/dashboard/assigned-requests"
                  icon={<FaTasks className="text-pink-500" />}
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
            className="text-pink-600 font-bold hover:text-pink-800 flex items-center gap-3 transition text-lg p-3 rounded-lg hover:bg-pink-100 shadow-md justify-center"
            aria-label="Logout"
          >
            <FaSignOutAlt className="text-xl" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Topbar */}
        <header className="md:hidden flex items-center justify-between bg-white px-5 py-3 border-b border-pink-200 shadow-sm z-20">
          <button
            onClick={toggleSidebar}
            className="text-3xl text-pink-600 hover:text-pink-800 transition"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1 className="text-xl font-extrabold text-pink-600 tracking-wider">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-pink-600 font-bold hover:text-pink-800 transition text-2xl"
            aria-label="Logout"
            title="Logout"
          >
            🔓
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-12 bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
          <div className="max-w-7xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-pink-200">
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
      className={`flex items-center gap-3 px-5 py-3 rounded-xl text-lg transition-all duration-300
        ${
          active
            ? "bg-pink-100 text-pink-700 font-extrabold border-l-6 border-pink-500 shadow-inner"
            : "text-pink-600 hover:bg-pink-200 hover:text-pink-800"
        }`}
    >
      <span className="text-xl">{icon}</span> {label}
    </Link>
  );
}

export default DashboardLayout;
