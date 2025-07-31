import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import AuthContext from "../../Context/AuthContext";

const MyDonationRequests = () => {
  const { user, loading } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("backendJwt");
      if (!token || !user?.email) {
        Swal.fire("Unauthorized", "Please log in first.", "error");
        setLoadingData(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://pulse-point-server-blue.vercel.app/donation-requests/user/${encodeURIComponent(
            user.email
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data || []);
      } catch (error) {
        console.error("Fetch Error:", error);
        Swal.fire("Error", "Failed to load requests.", "error");
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading) fetchRequests();
  }, [user, loading]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFiltered(requests);
    } else {
      setFiltered(requests.filter((req) => req.status === statusFilter));
    }
    setPage(1); // reset to first page on filter change
  }, [statusFilter, requests]);

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    inprogress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="px-4 py-6 md:px-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
        🩸 My Donation Requests
      </h2>

      {/* Filter */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              statusFilter === status
                ? "bg-red-500 text-white"
                : "border-red-300 text-red-600 hover:bg-red-100"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loadingData ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin w-8 h-8 text-red-500" />
        </div>
      ) : paginated.length === 0 ? (
        <p className="text-center text-gray-500">No donation requests found.</p>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:border-red-400 transition"
              >
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  {req.recipientName}
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">District:</span>{" "}
                  {req.recipientDistrict}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Upazila:</span>{" "}
                  {req.recipientUpazila}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Hospital:</span>{" "}
                  {req.hospitalName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Blood Group:</span>{" "}
                  {req.bloodGroup}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span> {req.donationDate}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span> {req.donationTime}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Message:</span>{" "}
                  {req.requestMessage}
                </p>
                <span
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${
                    statusColor[req.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {req.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full font-medium ${
                  page === i + 1
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 hover:bg-red-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyDonationRequests;
