import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

import { toast } from "react-toastify";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchRequest = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://pulse-point-server-blue.vercel.app/donation-requests/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch donation request");
        const data = await res.json();
        setRequest(data);
      } catch (err) {
        setError(err.message || "Error loading donation request");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, user, navigate]);

  const handleDonateConfirm = async () => {
    if (!request) return;

    setDonating(true);
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, {
        status: "inprogress",
        donorId: user._id, // optional, send donor info if needed
        donorName: user.name,
        donorEmail: user.email,
      });

      toast.success("Donation confirmed, status updated to In Progress");
      setRequest((prev) => ({ ...prev, status: "inprogress" }));
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to confirm donation", err.message);
    } finally {
      setDonating(false);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-red-600">Loading request...</p>;

  if (error)
    return <p className="text-center py-10 text-red-600">Error: {error}</p>;

  if (!request)
    return (
      <p className="text-center py-10 text-gray-500">
        Donation request not found.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-700">
        Donation Request Details
      </h1>

      <div className="border rounded-lg shadow p-6 mb-6 bg-white">
        <h2 className="text-2xl font-semibold mb-4">{request.recipientName}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p>
              <strong>Blood Group:</strong> {request.bloodGroup}
            </p>
            <p>
              <strong>Location:</strong> {request.district}, {request.division}
            </p>
            <p>
              <strong>Date:</strong> {request.donationDate}
            </p>
            <p>
              <strong>Time:</strong> {request.donationTime}
            </p>
          </div>
          <div>
            <p>
              <strong>Contact Number:</strong> {request.contactNumber || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  request.status === "pending"
                    ? "badge-warning"
                    : request.status === "inprogress"
                    ? "badge-info"
                    : request.status === "completed"
                    ? "badge-success"
                    : "badge-error"
                } capitalize`}
              >
                {request.status}
              </span>
            </p>
            <p>
              <strong>Additional Notes:</strong>{" "}
              {request.notes || "No additional notes"}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        disabled={request.status !== "pending"}
        className={`btn btn-primary ${
          request.status !== "pending" ? "btn-disabled" : ""
        }`}
      >
        Donate
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Confirm Donation</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDonateConfirm();
              }}
            >
              <div className="mb-4">
                <label className="block font-medium mb-1">Donor Name</label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Donor Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                  disabled={donating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={donating}
                >
                  {donating ? "Confirming..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
