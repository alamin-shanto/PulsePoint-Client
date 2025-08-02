import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("backendJwt");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast.warn("No user data found, please login.");
      setLoading(false);
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      toast.error("Corrupted user data, please login again.");
      setLoading(false);
      return;
    }

    const email = parsedUser?.email;
    if (!email) {
      toast.warn("User email missing, please login again.");
      setLoading(false);
      return;
    }

    axios
      .get(
        `https://pulse-point-server-blue.vercel.app/users/${encodeURIComponent(
          email
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch user data.");
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.email) {
      toast.error("User email is missing.");
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200 || res.status === 204) {
        const updatedUser = { ...user, ...updatedFields };
        setUser(updatedUser);
        setFormData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully.");
      } else {
        throw new Error("Unexpected response status: " + res.status);
      }
    } catch {
      toast.error("Update failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-indigo-600">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600">
        User not found.
      </div>
    );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl mt-12 mb-24">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={
                formData.avatar ||
                "https://res.cloudinary.com/duic0gfkw/image/upload/v1754083513/avatar-default-svgrepo-com_thzca7.svg"
              }
              alt="avatar"
              className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-gradient-to-tr from-purple-500 via-pink-500 to-red-500 shadow-xl object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {isEditing && (
              <input
                type="url"
                name="avatar"
                placeholder="Avatar image URL"
                value={formData.avatar || ""}
                onChange={handleChange}
                className="mt-4 w-full rounded-lg px-3 py-2 border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            )}
          </div>

          {/* Form */}
          <div className="flex-1 mt-8 md:mt-0 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-extrabold text-purple-700 drop-shadow-md">
                Your Profile
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 transition"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
                >
                  Save
                </button>
              )}
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    isEditing ? "bg-white" : "bg-gray-100 text-gray-600"
                  }`}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  disabled
                  className="w-full rounded-lg px-4 py-3 border bg-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Blood Group
                </label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    isEditing ? "bg-white" : "bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* Division */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Division
                </label>
                <input
                  type="text"
                  name="division"
                  value={formData.division || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    isEditing ? "bg-white" : "bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                    isEditing ? "bg-white" : "bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role || ""}
                  disabled
                  className="w-full rounded-lg px-4 py-3 border bg-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
