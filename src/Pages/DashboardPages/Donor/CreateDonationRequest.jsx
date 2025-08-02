import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AuthContext from "./../../../Context/AuthContext";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [userStatus, setUserStatus] = useState("active");

  const [formData, setFormData] = useState({
    requesterName: user?.displayName || user?.name || "",
    requesterEmail: user?.email || "",
    requesterAvatar: user?.avatar || "",
    recipientName: "",
    division: "",
    district: "",
    hospital: "",
    address: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    message: "",
  });

  useEffect(() => {
    fetch("/divisions.json")
      .then((res) => res.json())
      .then((data) => {
        const divisionTable = data.find(
          (item) => item.type === "table" && item.name === "divisions"
        );
        if (divisionTable?.data) {
          setDivisions(divisionTable.data);
        }
      });

    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => {
        const districtTable = data.find(
          (item) => item.type === "table" && item.name === "districts"
        );
        if (districtTable?.data) {
          setDistricts(districtTable.data);
        }
      });

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.status === "blocked") {
      setUserStatus("blocked");
    }
  }, []);

  const handleDivisionChange = (e) => {
    const selectedDivision = e.target.value;
    setFormData((prev) => ({
      ...prev,
      division: selectedDivision,
      district: "",
    }));

    const divisionObj = divisions.find((d) => d.name === selectedDivision);
    if (divisionObj) {
      const filtered = districts.filter(
        (dist) => dist.division_id === divisionObj.id
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userStatus === "blocked") {
      return Swal.fire(
        "Access Denied",
        "Blocked users cannot request donation.",
        "error"
      );
    }

    const requestData = {
      ...formData,
      status: "pending",
    };

    try {
      const token = localStorage.getItem("backendJwt");
      const res = await axios.post(
        "https://pulse-point-server-blue.vercel.app/donation-requests",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.insertedId) {
        Swal.fire(
          "Success",
          "Donation request created successfully!",
          "success"
        );
        setFormData({
          requesterName: user?.displayName || user?.name || "",
          requesterEmail: user?.email || "",
          requesterAvatar: user?.avatar || "",
          recipientName: "",
          division: "",
          district: "",
          hospital: "",
          address: "",
          bloodGroup: "",
          donationDate: "",
          donationTime: "",
          message: "",
        });
        setFilteredDistricts([]);
      }
    } catch (error) {
      console.error("Donation Request Error:", error);
      Swal.fire("Error", "Failed to create donation request.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-tr from-red-50 via-red-100 to-white rounded-3xl shadow-2xl mt-10 border border-red-300">
      <h2 className="text-4xl font-extrabold text-center text-red-700 mb-8 drop-shadow-md">
        🩸 Create Donation Request
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Requester Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["requesterName", "requesterEmail"].map((field, idx) => (
            <div key={idx}>
              <label
                htmlFor={field}
                className="block text-sm font-semibold text-red-600 mb-2"
              >
                {field === "requesterName"
                  ? "Requester Name"
                  : "Requester Email"}
              </label>
              <input
                type={field === "requesterEmail" ? "email" : "text"}
                name={field}
                id={field}
                value={formData[field]}
                readOnly
                className="w-full rounded-lg border border-red-300 bg-red-50 py-3 px-4 font-medium text-red-700 cursor-not-allowed shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          ))}
        </div>

        {/* Recipient Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="recipientName"
              className="block text-sm font-semibold text-red-600 mb-2"
            >
              Recipient Name
            </label>
            <input
              type="text"
              name="recipientName"
              id="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Enter recipient name"
              required
              className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="bloodGroup"
              className="block text-sm font-semibold text-red-600 mb-2"
            >
              Blood Group
            </label>
            <select
              name="bloodGroup"
              id="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Division and District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="division"
              className="block text-sm font-semibold text-red-600 mb-2"
            >
              Division
            </label>
            <select
              name="division"
              id="division"
              value={formData.division}
              onChange={handleDivisionChange}
              required
              className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
            >
              <option value="">Select Division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="district"
              className="block text-sm font-semibold text-red-600 mb-2"
            >
              District
            </label>
            <select
              name="district"
              id="district"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={!formData.division}
              className={`w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none transition-shadow duration-300 ${
                formData.division
                  ? "focus:ring-2 focus:ring-red-400"
                  : "bg-red-50 cursor-not-allowed"
              }`}
            >
              <option value="">Select District</option>
              {filteredDistricts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hospital & Address */}
        <div>
          <label
            htmlFor="hospital"
            className="block text-sm font-semibold text-red-600 mb-2"
          >
            Hospital Name
          </label>
          <input
            type="text"
            name="hospital"
            id="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="E.g., Dhaka Medical College"
            required
            className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-red-600 mb-2"
          >
            Full Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full address line"
            required
            className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="donationDate"
              className="block text-sm font-semibold text-red-600 mb-2"
            >
              Donation Date
            </label>
            <input
              type="date"
              name="donationDate"
              id="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="donationTime"
              className="block text-sm font-semibold text-red-600 mb-2"
            >
              Donation Time
            </label>
            <input
              type="time"
              name="donationTime"
              id="donationTime"
              value={formData.donationTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-red-600 mb-2"
          >
            Request Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Explain why you need the blood..."
            required
            rows="4"
            className="w-full rounded-lg border border-red-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow duration-300 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={userStatus === "blocked"}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg hover:bg-red-700 active:scale-95 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
