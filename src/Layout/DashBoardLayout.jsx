import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 h-full w-64 bg-white border-r shadow-md transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-red-600 mb-8 hidden md:block text-center">
              Dashboard
            </h2>
            <nav className="flex flex-col gap-4 font-medium">
              <Link
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="hover:text-red-600 transition"
              >
                🏠 Home
              </Link>
              <Link
                to="/dashboard/profile"
                onClick={() => setSidebarOpen(false)}
                className="hover:text-red-600 transition"
              >
                🙍‍♂️ Profile
              </Link>
              <Link
                to="/dashboard/my-donation-requests"
                onClick={() => setSidebarOpen(false)}
                className="hover:text-red-600 transition"
              >
                🩸 My Requests
              </Link>
              <Link
                to="/dashboard/create-donation-request"
                onClick={() => setSidebarOpen(false)}
                className="hover:text-red-600 transition"
              >
                ➕ Create Request
              </Link>
            </nav>
          </div>

          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="text-red-600 font-semibold hover:text-red-800 transition"
          >
            🔓 Logout
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
        {/* Topbar for mobile */}
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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
