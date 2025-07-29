import React, { useState, useEffect } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Register() {
  const [divisions, setDivisions] = useState([]);
  const [districtsMap, setDistrictsMap] = useState({});
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    avatar: null,
    bloodGroup: "",
    division: "",
    district: "",
    password: "",
    confirm_password: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/division.json")
      .then((res) => res.json())
      .then((data) => setDivisions(data))
      .catch(() => setError("Failed to load divisions"));

    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistrictsMap(data))
      .catch(() => setError("Failed to load districts"));
  }, []);

  useEffect(() => {
    if (formData.division && districtsMap[formData.division]) {
      setDistricts(districtsMap[formData.division]);
    } else {
      setDistricts([]);
    }
    setFormData((fd) => ({ ...fd, district: "" }));
  }, [formData.division, districtsMap]);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (
      !formData.email ||
      !formData.name ||
      !formData.bloodGroup ||
      !formData.division ||
      !formData.district ||
      !formData.password
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          avatar: avatarPreview,
          bloodGroup: formData.bloodGroup,
          division: formData.division,
          district: formData.district,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (res.ok && !data.message) {
        setSuccessMsg("Registration successful!");
        setFormData({
          email: "",
          name: "",
          avatar: null,
          bloodGroup: "",
          division: "",
          district: "",
          password: "",
          confirm_password: "",
        });
        setAvatarPreview(null);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error", err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
        Create Your Donor Profile
      </h2>
      {error && <p className="mb-4 text-red-500 font-medium">{error}</p>}
      {successMsg && (
        <p className="mb-4 text-green-600 font-medium">{successMsg}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />

        <div>
          <label className="block text-sm mb-1 text-gray-600 font-medium">
            Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full text-sm text-gray-500"
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Preview"
              className="w-20 h-20 rounded-full mt-3 object-cover mx-auto"
            />
          )}
        </div>

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          name="division"
          value={formData.division}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          disabled={!formData.division}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none disabled:bg-gray-100"
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />

        <input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded shadow transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
