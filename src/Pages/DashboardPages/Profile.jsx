import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://pulsepoint-server.vercel.app/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `https://pulsepoint-server.vercel.app/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data);
      setFormData(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-red-500 object-cover"
        />
        <form className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-2 border rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">
              Blood Group
            </label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-2 border rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Division</label>
            <input
              type="text"
              name="division"
              value={formData.division || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-2 border rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">District</label>
            <input
              type="text"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full mt-1 p-2 border rounded ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role || ""}
              disabled
              className="w-full mt-1 p-2 border rounded bg-gray-100"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
