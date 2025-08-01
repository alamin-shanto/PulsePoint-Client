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

  // 🧠 useQuery must be called unconditionally
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

  // ❗ check access after hook calls
  if (!user || user.role !== "admin") {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Access Denied. Admins only.
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
      toast.success("Request deleted");
      refetch();
    } catch (err) {
      toast.error("Failed to delete request", err.message);
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
      toast.success("Request updated");
      setSelectedRequest(null);
      refetch();
    } catch (err) {
      toast.error("Failed to update", err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        🩸 All Blood Donation Requests (Admin)
      </h2>

      <div className="mb-4 flex items-center gap-4">
        <label>Status:</label>
        <select
          className="select select-bordered select-sm"
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
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="table table-zebra w-full">
            <thead className="bg-red-100">
              <tr>
                <th>#</th>
                <th>Requester</th>
                <th>Blood Group</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req, index) => (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={req.requesterAvatar || "/default-avatar.png"}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{req.requesterName}</p>
                        <p className="text-sm text-gray-500">
                          {req.requesterEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>{req.bloodGroup}</td>
                  <td>
                    {req.district}, {req.upazila}
                  </td>
                  <td>{req.donationDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        req.status === "pending"
                          ? "badge-warning"
                          : req.status === "completed"
                          ? "badge-success"
                          : req.status === "cancelled"
                          ? "badge-error"
                          : "badge-info"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="btn btn-sm btn-outline btn-info"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No matching donation requests.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">Edit Request</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
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
                <label className="block text-sm font-medium mb-1">Status</label>
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
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;
