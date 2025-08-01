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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold">All Users</h2>
        <div className="space-x-2">
          {["all", "active", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded ${
                statusFilter === status
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Avatar
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500 select-none">
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
                <td className="px-4 py-3 text-sm">{user.name}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                <td className="px-4 py-3 text-sm capitalize">{user.status}</td>
                <td
                  className="px-4 py-3 text-center relative"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() =>
                      setDropdownOpenId(
                        dropdownOpenId === user._id ? null : user._id
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                  >
                    Actions ▼
                  </button>

                  {dropdownOpenId === user._id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-md z-10 text-left">
                      {user.status === "active" ? (
                        <button
                          onClick={() =>
                            handleUpdateStatus(user._id, "blocked")
                          }
                          className="block w-full px-4 py-2 text-sm hover:bg-red-100"
                        >
                          Block User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(user._id, "active")}
                          className="block w-full px-4 py-2 text-sm hover:bg-green-100"
                        >
                          Unblock User
                        </button>
                      )}

                      {user.role !== "volunteer" && (
                        <button
                          onClick={() =>
                            handleUpdateRole(user._id, "volunteer")
                          }
                          className="block w-full px-4 py-2 text-sm hover:bg-blue-100"
                        >
                          Make Volunteer
                        </button>
                      )}
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleUpdateRole(user._id, "admin")}
                          className="block w-full px-4 py-2 text-sm hover:bg-yellow-100"
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
      </div>
    </div>
  );
};

export default AllUsers;
