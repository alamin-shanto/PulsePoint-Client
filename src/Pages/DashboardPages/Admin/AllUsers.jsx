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
      const res = await axiosSecure.patch(`/users/${id}`, { role: newRole });
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
      <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700">
          All Users
        </h2>
        <div className="flex flex-wrap gap-2">
          {["all", "active", "blocked"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                statusFilter === status
                  ? "bg-red-600 text-white shadow"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
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
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse border border-gray-200 shadow-md">
              <thead className="bg-red-50 border-b border-red-200">
                <tr>
                  {["Avatar", "Name", "Email", "Role", "Status", "Actions"].map(
                    (title) => (
                      <th
                        key={title}
                        className="px-4 py-3 text-left font-semibold text-red-700"
                      >
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-red-50">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-lg font-bold text-gray-500">
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
                    <td className="px-4 py-3 font-semibold text-red-700">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          roleColors[user.role] || roleColors.user
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          statusColors[user.status] || statusColors.active
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 relative"
                      ref={(el) => (dropdownRefs.current[user._id] = el)}
                    >
                      <button
                        onClick={() =>
                          setDropdownOpenId(
                            dropdownOpenId === user._id ? null : user._id
                          )
                        }
                        className="text-xs px-3 py-1 bg-red-100 rounded-md hover:bg-red-200 text-red-700"
                      >
                        Actions ▼
                      </button>

                      {dropdownOpenId === user._id && (
                        <div
                          className="absolute right-0 mt-2 w-44 bg-white border border-red-300 rounded-md shadow-lg z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {user.status === "active" ? (
                            <button
                              onClick={() =>
                                handleUpdateStatus(user._id, "blocked")
                              }
                              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                            >
                              Block User
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUpdateStatus(user._id, "active")
                              }
                              className="block w-full text-left px-4 py-2 text-green-600 hover:bg-green-50"
                            >
                              Unblock User
                            </button>
                          )}

                          {user.role !== "volunteer" && (
                            <button
                              onClick={() =>
                                handleUpdateRole(user._id, "volunteer")
                              }
                              className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50"
                            >
                              Make Volunteer
                            </button>
                          )}

                          {user.role !== "admin" && (
                            <button
                              onClick={() =>
                                handleUpdateRole(user._id, "admin")
                              }
                              className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-50"
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

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-lg font-bold text-gray-500">
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
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-red-700">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 break-all">
                      {user.email}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          roleColors[user.role] || roleColors.user
                        }`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          statusColors[user.status] || statusColors.active
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-sm">
                  {user.status === "active" ? (
                    <button
                      onClick={() => handleUpdateStatus(user._id, "blocked")}
                      className="w-full py-2 text-red-600 border border-red-200 rounded hover:bg-red-50"
                    >
                      Block User
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(user._id, "active")}
                      className="w-full py-2 text-green-600 border border-green-200 rounded hover:bg-green-50"
                    >
                      Unblock User
                    </button>
                  )}

                  {user.role !== "volunteer" && (
                    <button
                      onClick={() => handleUpdateRole(user._id, "volunteer")}
                      className="w-full py-2 text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                    >
                      Make Volunteer
                    </button>
                  )}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleUpdateRole(user._id, "admin")}
                      className="w-full py-2 text-yellow-600 border border-yellow-200 rounded hover:bg-yellow-50"
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllUsers;
