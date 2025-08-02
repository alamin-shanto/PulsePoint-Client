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
      <div className="p-8 text-center text-red-600 font-bold text-lg">
        🚫 Access Denied — Admins only.
      </div>
    );
  }

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((req) => req.status === statusFilter);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-red-700 mb-8 text-center tracking-wide drop-shadow-md">
        🩸 All Blood Donation Requests (Admin)
      </h2>

      {/* Filter */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
        <label
          htmlFor="statusFilter"
          className="text-lg font-semibold text-gray-700"
        >
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          className="select select-bordered select-md max-w-xs shadow-md hover:shadow-red-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
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
        <div className="text-center py-16 text-red-600 font-bold text-xl animate-pulse">
          Loading requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-xl font-medium">
          No requests found.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl shadow-lg border border-red-200">
            <table className="table-auto w-full text-sm sm:text-base border-collapse">
              <thead className="bg-red-50 border-b-2 border-red-300">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700 w-12">
                    #
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700 max-w-[180px]">
                    Requester
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700 w-28">
                    Blood Group
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700 max-w-[180px]">
                    Location
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700 w-36">
                    Date
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700 w-32">
                    Status
                  </th>
                  <th className="p-4 text-center font-semibold text-gray-700 w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req, i) => (
                  <tr
                    key={req._id}
                    className={`transition-colors duration-200 cursor-pointer ${
                      i % 2 === 0 ? "bg-white" : "bg-red-50"
                    } hover:bg-red-100`}
                  >
                    <td className="p-4 align-middle">{i + 1}</td>
                    <td className="p-4 flex items-center gap-3 max-w-[180px] min-w-0 truncate">
                      <img
                        src={
                          req.requesterAvatar ||
                          "https://res.cloudinary.com/duic0gfkw/image/upload/v1754083513/avatar-default-svgrepo-com_thzca7.svg"
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full border flex-shrink-0 object-cover"
                      />
                      <div className="truncate min-w-0">
                        <p className="font-semibold text-red-700 truncate">
                          {req.requesterName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {req.requesterEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-red-600 w-28">
                      {req.bloodGroup}
                    </td>
                    <td className="p-4 text-gray-700 max-w-[180px] truncate">
                      {req.district}, {req.division}
                    </td>
                    <td className="p-4 font-mono text-gray-600 w-36">
                      {req.donationDate}
                    </td>
                    <td className="p-4 w-32">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
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
                    <td className="p-4 text-center w-36 flex justify-center gap-3">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="btn btn-sm btn-outline btn-info flex items-center gap-2 whitespace-nowrap hover:bg-red-600 hover:text-white transition"
                        aria-label={`Edit request #${i + 1}`}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="btn btn-sm btn-outline btn-error flex items-center gap-2 whitespace-nowrap hover:bg-red-800 hover:text-white transition"
                        aria-label={`Delete request #${i + 1}`}
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-6 px-2 sm:px-0">
            {filteredRequests.map((req, i) => {
              console.log(req);
              return (
                <div
                  key={req._id}
                  className="border rounded-xl shadow-md p-5 bg-white flex flex-col space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        req.requesterAvatar ||
                        "https://res.cloudinary.com/duic0gfkw/image/upload/v1754083513/avatar-default-svgrepo-com_thzca7.svg"
                      }
                      alt="avatar"
                      className="w-14 h-14 rounded-full border object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-red-700 truncate">
                        {req.requesterName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600 truncate break-words">
                        {req.requesterEmail}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm font-medium">
                    <div>
                      <span className="block mb-1 font-semibold">
                        Blood Group
                      </span>
                      <span className="text-red-600">{req.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="block mb-1 font-semibold">Location</span>
                      <span>
                        {req.district}, {req.division}
                      </span>
                    </div>
                    <div>
                      <span className="block mb-1 font-semibold">Date</span>
                      <span className="font-mono">{req.donationDate}</span>
                    </div>
                    <div>
                      <span className="block mb-1 font-semibold">Status</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
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
                    </div>
                  </div>

                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="flex-1 btn btn-outline btn-info flex items-center justify-center gap-2 whitespace-nowrap hover:bg-red-600 hover:text-white transition"
                      aria-label={`Edit request #${i + 1}`}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="flex-1 btn btn-outline btn-error flex items-center justify-center gap-2 whitespace-nowrap hover:bg-red-800 hover:text-white transition"
                      aria-label={`Delete request #${i + 1}`}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {selectedRequest && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4"
              aria-modal="true"
              role="dialog"
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8 relative max-h-[90vh] overflow-y-auto">
                <h3
                  id="modal-title"
                  className="text-2xl font-bold text-red-700 mb-6 text-center"
                >
                  Edit Donation Request
                </h3>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label
                      htmlFor="donationDate"
                      className="block font-semibold mb-2 text-gray-700"
                    >
                      Donation Date
                    </label>
                    <input
                      type="date"
                      name="donationDate"
                      id="donationDate"
                      defaultValue={selectedRequest.donationDate}
                      className="input input-bordered w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block font-semibold mb-2 text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      defaultValue={selectedRequest.status}
                      className="select select-bordered w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(null)}
                      className="btn btn-outline border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="absolute top-4 right-5 text-gray-500 hover:text-red-700 text-3xl font-bold"
                  aria-label="Close modal"
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
