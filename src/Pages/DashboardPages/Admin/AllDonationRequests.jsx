import { useQuery } from "@tanstack/react-query";
import { useState, useContext } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import AuthContext from "../../../Context/AuthContext";

const AllDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: requests = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["allDonationRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests");
      return res.data;
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-center text-red-600 font-semibold text-lg">
        🚫 Access Denied — Admins only.
      </div>
    );
  }

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((req) => req.status === statusFilter);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      toast.success("Request deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete request");
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const status = form.status.value;
    const donationDate = form.donationDate.value;

    try {
      await axiosSecure.patch(`/donation-requests/${selectedRequest._id}`, {
        status,
        donationDate,
      });
      toast.success("Request updated successfully");
      setSelectedRequest(null);
      refetch();
    } catch (err) {
      toast.error("Failed to update request");
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-red-700 mb-6 sm:mb-8 text-center tracking-wide drop-shadow-md">
        🩸 All Blood Donation Requests (Admin)
      </h2>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        <label
          htmlFor="statusFilter"
          className="text-base sm:text-lg font-semibold text-gray-700"
        >
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          className="select select-bordered select-sm sm:select-md max-w-xs shadow-lg hover:shadow-red-400 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-14 text-red-600 font-semibold text-xl animate-pulse">
          Loading requests...
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg border border-red-200">
            <table className="table-auto w-full min-w-[640px] border-collapse text-sm sm:text-base">
              <thead className="bg-red-50 border-b-2 border-red-300">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 min-w-[160px]">
                    Requester
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Blood Group
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 min-w-[140px]">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-700 min-w-[120px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req, i) => (
                    <tr
                      key={req._id}
                      className="odd:bg-white even:bg-red-50 hover:bg-red-100 transition"
                    >
                      <td className="py-3 px-4">{i + 1}</td>
                      <td className="py-3 px-4 flex gap-2 items-center truncate max-w-[220px]">
                        <img
                          src={req.requesterAvatar || "/default-avatar.png"}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border"
                          alt="avatar"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-red-700 truncate">
                            {req.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {req.requesterEmail}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-red-600">
                        {req.bloodGroup}
                      </td>
                      <td className="py-3 px-4 text-gray-700 break-words max-w-[180px]">
                        {req.district}, {req.division}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">
                        {req.donationDate}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            req.status === "pending"
                              ? "bg-yellow-200 text-yellow-900"
                              : req.status === "completed"
                              ? "bg-green-200 text-green-900"
                              : req.status === "cancelled"
                              ? "bg-red-200 text-red-900"
                              : "bg-blue-200 text-blue-900"
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="btn btn-sm btn-outline btn-info flex items-center justify-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(req._id)}
                            className="btn btn-sm btn-outline btn-error flex items-center justify-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No requests found.
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req._id}
                  className="border rounded-lg shadow p-4 bg-white"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={req.requesterAvatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border"
                    />
                    <div className="flex-1 truncate">
                      <p className="font-semibold text-red-700 truncate">
                        {req.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {req.requesterEmail}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mb-2">
                    <p>
                      <strong>Blood Group:</strong> {req.bloodGroup}
                    </p>
                    <p>
                      <strong>Location:</strong> {req.district}, {req.division}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      <span className="font-mono">{req.donationDate}</span>
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          req.status === "pending"
                            ? "bg-yellow-200 text-yellow-900"
                            : req.status === "completed"
                            ? "bg-green-200 text-green-900"
                            : req.status === "cancelled"
                            ? "bg-red-200 text-red-900"
                            : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 flex-wrap">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="btn btn-sm btn-outline btn-info flex items-center justify-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="btn btn-sm btn-outline btn-error flex items-center justify-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md mx-auto p-6 overflow-y-auto max-h-[90vh] relative">
                <h3 className="text-lg sm:text-xl font-semibold text-red-700 mb-4">
                  Edit Donation Request
                </h3>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label
                      htmlFor="donationDate"
                      className="block font-medium text-sm mb-2"
                    >
                      Donation Date
                    </label>
                    <input
                      type="date"
                      name="donationDate"
                      defaultValue={selectedRequest.donationDate}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block font-medium text-sm mb-2"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedRequest.status}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="btn btn-outline text-red-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary bg-red-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="absolute top-3 right-4 text-gray-500 text-xl font-bold hover:text-red-700"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllDonationRequests;
