import { useEffect, useState, useRef } from "react";

import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    axiosSecure.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, [axiosSecure]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(e.target)
      );
      if (!isClickInside) setDropdownOpenId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title:
        newStatus === "blocked" ? "Block this user?" : "Unblock this user?",
      text: `Are you sure you want to ${newStatus} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${newStatus}`,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/users/${id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
        setDropdownOpenId(null);
        toast.success(
          `User ${
            newStatus === "blocked" ? "blocked" : "unblocked"
          } successfully.`
        );
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update user status.");
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/${id}`, {
        role: newRole,
      });

      if (res.data.modifiedCount > 0) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role: newRole } : user
          )
        );
        setDropdownOpenId(null);
        toast.success(`User promoted to ${newRole}`);
      }
    } catch (err) {
      console.error("Role update failed:", err);
      toast.error("Failed to update user role.");
    }
  };

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 flex-wrap">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 drop-shadow-sm">
          All Users
        </h2>
        <div className="flex flex-wrap gap-3">
          {["all", "active", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition text-sm ${
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

      {filteredUsers.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg font-semibold">No users found.</p>
          <p className="max-w-sm mx-auto">
            Try changing the filter or check back later.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[640px] border-collapse rounded-md shadow-md border border-gray-200 text-sm">
            <thead className="bg-red-50 border-b border-red-200">
              <tr>
                {["Avatar", "Name", "Email", "Role", "Status", "Actions"].map(
                  (title) => (
                    <th
                      key={title}
                      className="px-4 sm:px-6 py-4 text-left font-semibold text-red-700"
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
                  className="hover:bg-red-50 transition"
                  onClick={() => setDropdownOpenId(null)}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-400">
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
                  <td className="px-4 sm:px-6 py-4 font-medium text-red-700">
                    {user.name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-600 break-words max-w-[180px]">
                    {user.email}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        roleColors[user.role] || roleColors.user
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[user.status] || statusColors.active
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td
                    className="px-4 sm:px-6 py-4 relative text-center"
                    ref={(el) => (dropdownRefs.current[user._id] = el)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenId(
                          dropdownOpenId === user._id ? null : user._id
                        );
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-sm text-xs"
                    >
                      Actions ▼
                    </button>

                    {dropdownOpenId === user._id && (
                      <div
                        className="absolute right-0 mt-2 w-44 sm:w-48 bg-white border border-red-300 rounded-md shadow-lg z-50 text-left text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.status === "active" ? (
                          <button
                            onClick={() =>
                              handleUpdateStatus(user._id, "blocked")
                            }
                            className="block w-full px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            Block User
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUpdateStatus(user._id, "active")
                            }
                            className="block w-full px-4 py-2 text-green-600 hover:bg-green-50"
                          >
                            Unblock User
                          </button>
                        )}

                        {user.role !== "volunteer" && (
                          <button
                            onClick={() =>
                              handleUpdateRole(user._id, "volunteer")
                            }
                            className="block w-full px-4 py-2 text-blue-600 hover:bg-blue-50"
                          >
                            Make Volunteer
                          </button>
                        )}

                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleUpdateRole(user._id, "admin")}
                            className="block w-full px-4 py-2 text-yellow-600 hover:bg-yellow-50"
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
      )}
    </div>
  );
};

export default AllUsers;
