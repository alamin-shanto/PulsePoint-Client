import { useEffect, useState, useRef } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axiosSecure.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, [axiosSecure]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateStatus = (id, status) => {
    axiosSecure.patch(`/users/${id}/status`, { status }).then(() => {
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, status } : user))
      );
      setDropdownOpenId(null);
    });
  };

  const handleUpdateRole = (id, role) => {
    axiosSecure.patch(`/users/${id}/role`, { role }).then(() => {
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, role } : user))
      );
      setDropdownOpenId(null);
    });
  };

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

  // Helper for badge colors
  const roleColors = {
    admin: "bg-yellow-100 text-yellow-800",
    volunteer: "bg-blue-100 text-blue-800",
    user: "bg-gray-100 text-gray-700",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    blocked: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-red-700 drop-shadow-sm">
          All Users
        </h2>
        <div className="flex space-x-3">
          {["all", "active", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-2 rounded-lg font-semibold shadow-sm transition ${
                statusFilter === status
                  ? "bg-red-600 text-white shadow-red-500/60"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={statusFilter === status}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 mx-auto text-red-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-3-3v6m-7.5 7.5v-15a3 3 0 013-3h9a3 3 0 013 3v15a3 3 0 01-3 3H6a3 3 0 01-3-3z"
              />
            </svg>
            <p className="text-lg font-semibold">No users found.</p>
            <p className="max-w-sm">
              Looks like there are no users matching your criteria right now.
              Please try changing the filter or check back later.
            </p>
          </div>
        ) : (
          <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-red-50 border-b border-red-200">
              <tr>
                {["Avatar", "Name", "Email", "Role", "Status", "Actions"].map(
                  (title) => (
                    <th
                      key={title}
                      className="px-6 py-4 text-left text-sm font-semibold text-red-700 tracking-wide select-none"
                    >
                      {title}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-red-50 transition duration-150 cursor-pointer"
                  onClick={() => setDropdownOpenId(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 select-none">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-red-700">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        roleColors[user.role] || roleColors.user
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[user.status] || statusColors.active
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 relative text-center"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenId(
                          dropdownOpenId === user._id ? null : user._id
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition shadow-sm"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpenId === user._id}
                    >
                      Actions ▼
                    </button>

                    {dropdownOpenId === user._id && (
                      <div
                        className="absolute right-0 mt-2 w-44 bg-white border border-red-300 rounded-md shadow-lg z-20 text-left text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.status === "active" ? (
                          <button
                            onClick={() =>
                              handleUpdateStatus(user._id, "blocked")
                            }
                            className="block w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            Block User
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUpdateStatus(user._id, "active")
                            }
                            className="block w-full px-4 py-2 text-green-600 hover:bg-green-50 transition"
                          >
                            Unblock User
                          </button>
                        )}

                        {user.role !== "volunteer" && (
                          <button
                            onClick={() =>
                              handleUpdateRole(user._id, "volunteer")
                            }
                            className="block w-full px-4 py-2 text-blue-600 hover:bg-blue-50 transition"
                          >
                            Make Volunteer
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleUpdateRole(user._id, "admin")}
                            className="block w-full px-4 py-2 text-yellow-600 hover:bg-yellow-50 transition"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
