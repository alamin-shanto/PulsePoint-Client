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
        donorId: user._id,
        donorName: user.displayName || user.name || "Donor",
        donorEmail: user.email,
      });

      toast.success("Donation confirmed. Status set to In Progress.");
      setRequest((prev) => ({ ...prev, status: "inprogress" }));
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to confirm donation.");
      console.error(err);
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-red-700 mb-2">
            🩸 Donation Request Details
          </h1>
          <span className="block w-20 h-1 bg-red-600 mx-auto rounded-full"></span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {request.recipientName}
            </h2>
            <p className="text-sm text-gray-500">
              📅 {request.donationDate} ⏰ {request.donationTime}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Blood Group:</span>{" "}
                <span className="text-red-600 font-bold">
                  {request.bloodGroup}
                </span>
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {request.district}, {request.division}
              </p>
              <p>
                <span className="font-semibold">Contact Number:</span>{" "}
                {request.contactNumber || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "inprogress"
                      ? "bg-blue-100 text-blue-800"
                      : request.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Notes:</span>{" "}
                {request.notes || "No additional notes."}
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setShowModal(true)}
              disabled={request.status !== "pending"}
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition ${
                request.status !== "pending"
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              I Want to Donate
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-md bg-white text-red-600 border border-red-300 hover:bg-red-50 shadow"
          >
            ⬅️ Back to Requests
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg animate-fade-in relative">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Donation
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDonateConfirm();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={user.displayName || user.name || "Donor"}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={donating}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
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
