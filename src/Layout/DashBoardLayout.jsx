// src/layouts/DashboardLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 space-y-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard">🏠 Home</Link>
          <Link to="/dashboard/profile">🙍‍♂️ Profile</Link>
          <Link to="/dashboard/my-donation-requests">🩸 My Requests</Link>
          <Link to="/dashboard/create-donation-request">➕ Create Request</Link>
          <button
            onClick={handleLogout}
            className="mt-6 text-red-600 font-semibold"
          >
            🔓 Logout
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
