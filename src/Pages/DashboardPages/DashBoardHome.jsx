// src/pages/dashboard/DashboardHome.jsx
import React from "react";

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const donationRequests = []; // Later fetch from Firestore

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Welcome back, {user?.name || "Donor"}!
      </h1>

      {donationRequests.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Recent Donation Requests
          </h2>
          <table className="w-full border rounded">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donationRequests.slice(0, 3).map((req) => (
                <tr key={req.id} className="border-t">
                  <td>{req.recipientName}</td>
                  <td>
                    {req.recipientDistrict}, {req.recipientUpazila}
                  </td>
                  <td>{req.donationDate}</td>
                  <td>{req.donationTime}</td>
                  <td>{req.bloodGroup}</td>
                  <td>{req.status}</td>
                  <td>
                    <button className="text-blue-600">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              onClick={() =>
                (window.location.href = "/dashboard/my-donation-requests")
              }
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              View My All Requests
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
