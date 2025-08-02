import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardHome() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const donationRequests = [];

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 lg:p-10 bg-gradient-to-b from-red-50 via-white to-gray-100">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 drop-shadow-md">
          Welcome back, {user?.name || "Donor"}!
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Here’s a quick overview of your blood donation activity.
        </p>
      </div>

      {donationRequests.length > 0 ? (
        <section>
          <h2 className="text-2xl font-semibold text-red-700 mb-6 text-center">
            Recent Donation Requests
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg border border-gray-200 bg-white">
            <table className="min-w-full">
              <thead className="bg-red-100 text-red-700 font-semibold">
                <tr>
                  <th className="py-3 px-6 text-left">Recipient</th>
                  <th className="py-3 px-6 text-left">Location</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Time</th>
                  <th className="py-3 px-6 text-left">Blood Group</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>{/* Map donationRequests */}</tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-5 mt-6">
            {/* Map mobile cards here */}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate("/dashboard/my-donation-requests")}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              View All My Requests
            </button>
          </div>
        </section>
      ) : (
        <div className="text-center mt-24">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5948/5948565.png"
            alt="No requests"
            className="w-24 h-24 mx-auto opacity-60 mb-4"
          />
          <p className="text-gray-500 text-lg sm:text-xl font-medium">
            You don’t have any donation requests yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default DashboardHome;
