import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("backendJwt");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.warn("No user data in localStorage");
      setLoading(false);
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.warn("Error parsing localStorage user data", error);
      setLoading(false);
      return;
    }

    const email = parsedUser?.email;
    if (!email) {
      console.warn("No email found in localStorage user");
      setLoading(false);
      return;
    }

    axios
      .get(
        `https://pulse-point-server-blue.vercel.app/users/${encodeURIComponent(
          email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.email) {
      alert("User email is missing.");
      return;
    }

    try {
      const updatedFields = {
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        division: formData.division,
        district: formData.district,
        avatar: formData.avatar,
      };

      const res = await axios.patch(
        `https://pulse-point-server-blue.vercel.app/users/email/${encodeURIComponent(
          user.email
        )}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 204) {
        const updatedUser = { ...user, ...updatedFields };
        setUser(updatedUser);
        setFormData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully.");
      } else {
        throw new Error("Unexpected response status: " + res.status);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Update failed. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!user) return <div className="text-center py-10">User not found.</div>;

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
          src={
            formData.avatar ||
            "https://res.cloudinary.com/duic0gfkw/image/upload/v1754083513/avatar-default-svgrepo-com_thzca7.svg"
          }
          alt="avatar"
          className="w-32 h-32 rounded-full border-4 border-red-500 object-cover"
        />
        <form
          className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
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
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
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
