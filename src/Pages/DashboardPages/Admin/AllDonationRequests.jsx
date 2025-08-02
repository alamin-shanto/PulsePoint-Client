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
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-red-700 mb-8 text-center tracking-wide drop-shadow-md">
        🩸 All Blood Donation Requests (Admin)
      </h2>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap justify-center items-center gap-6">
        <label
          htmlFor="statusFilter"
          className="text-lg font-semibold text-gray-700"
        >
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          className="select select-bordered select-md max-w-xs shadow-lg hover:shadow-red-400 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
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
          <div className="overflow-x-auto rounded-lg shadow-lg border border-red-200">
            <table className="table-auto w-full min-w-[720px] border-collapse">
              <thead className="bg-red-50 border-b-2 border-red-300">
                <tr>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold tracking-wide">
                    #
                  </th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold tracking-wide">
                    Requester
                  </th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold tracking-wide">
                    Blood Group
                  </th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold tracking-wide">
                    Location
                  </th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold tracking-wide">
                    Date
                  </th>
                  <th className="py-3 px-5 text-left text-gray-700 font-semibold tracking-wide">
                    Status
                  </th>
                  <th className="py-3 px-5 text-center text-gray-700 font-semibold tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 py-10 text-lg"
                    >
                      No donation requests matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req, i) => (
                    <tr
                      key={req._id}
                      className="odd:bg-white even:bg-red-50 hover:bg-red-100 transition-colors duration-200"
                    >
                      <td className="py-3 px-5 text-gray-700 font-medium">
                        {i + 1}
                      </td>
                      <td className="py-3 px-5 flex items-center gap-3">
                        <img
                          src={req.requesterAvatar || "/default-avatar.png"}
                          alt="avatar"
                          className="w-10 h-10 rounded-full border-2 border-red-300"
                        />
                        <div>
                          <p className="font-semibold text-red-700">
                            {req.name || req.role || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {req.requesterEmail}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-5 font-semibold text-red-600">
                        {req.bloodGroup}
                      </td>
                      <td className="py-3 px-5 text-gray-700">
                        {req.district}, {req.division}
                      </td>
                      <td className="py-3 px-5 font-mono text-gray-600">
                        {req.donationDate}
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
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
                      <td className="py-3 px-5 flex justify-center gap-3">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="btn btn-sm btn-outline btn-info flex items-center justify-center gap-1 hover:bg-blue-600 hover:text-white transition-colors duration-300"
                          title="Edit Request"
                          aria-label={`Edit request ${req._id}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="btn btn-sm btn-outline btn-error flex items-center justify-center gap-1 hover:bg-red-600 hover:text-white transition-colors duration-300"
                          title="Delete Request"
                          aria-label={`Delete request ${req._id}`}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                <h3 className="text-2xl font-semibold mb-5 text-red-700">
                  Edit Donation Request
                </h3>
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label
                      htmlFor="donationDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Donation Date
                    </label>
                    <input
                      type="date"
                      id="donationDate"
                      name="donationDate"
                      defaultValue={selectedRequest.donationDate}
                      className="input input-bordered w-full focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={selectedRequest.status}
                      className="select select-bordered w-full focus:ring-2 focus:ring-red-400"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="btn btn-outline text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
                <button
                  aria-label="Close modal"
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-xl font-bold"
                  onClick={() => setSelectedRequest(null)}
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
