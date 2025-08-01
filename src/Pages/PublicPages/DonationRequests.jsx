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
    navigate(`/donation-request/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-red-700 mb-8 text-center">
        Pending Blood Donation Requests
      </h1>

      {loading && (
        <p className="text-center text-red-600">Loading donation requests...</p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p className="text-center text-gray-500">
          No pending donation requests found.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {req.recipientName}
              </h2>
              <p>
                <strong>Location:</strong> {req.district}, {req.division}
              </p>
              <p>
                <strong>Blood Group:</strong> {req.bloodGroup}
              </p>
              <p>
                <strong>Date:</strong> {req.donationDate}
              </p>
              <p>
                <strong>Time:</strong> {req.donationTime}
              </p>
            </div>

            <button
              onClick={() => handleView(req._id)}
              className="btn btn-primary mt-4"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationRequests;
