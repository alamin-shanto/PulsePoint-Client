import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

const DonationRequests = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://pulse-point-server-blue.vercel.app/donation-requests?status=pending"
        );
        if (!res.ok) throw new Error("Failed to fetch donation requests");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Error fetching requests");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleView = (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/donation-requests/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-red-700 relative inline-block pb-2">
            🩸 Pending Blood Donation Requests
            <span className="block h-1 w-24 bg-red-600 mt-2 mx-auto rounded-full"></span>
          </h1>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-md bg-white text-red-600 border border-red-300 hover:bg-red-50 shadow"
            >
              ⬅️ Back to Home
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 shadow"
            >
              📂 Go to Dashboard
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-center text-red-600 text-lg font-medium">
            Loading donation requests...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 text-lg font-medium">
            {error}
          </p>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            No pending donation requests found.
          </p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req._id}
              className="rounded-2xl shadow-xl border border-red-100 bg-white hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {req.recipientName}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  📍 <span className="font-medium">{req.district}</span>,{" "}
                  <span>{req.division}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  🩸 <span className="font-medium">Blood Group:</span>{" "}
                  <span className="text-red-600 font-bold">
                    {req.bloodGroup}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📅 <span className="font-medium">Date:</span>{" "}
                  {req.donationDate}
                </p>
                <p className="text-sm text-gray-600">
                  ⏰ <span className="font-medium">Time:</span>{" "}
                  {req.donationTime}
                </p>
              </div>

              <button
                onClick={() => handleView(req._id)}
                className="mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationRequests;
