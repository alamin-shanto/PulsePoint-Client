import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { auth } from "../../Firebase/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function Register() {
  const navigate = useNavigate();

  const [divisions, setDivisions] = useState([]);
  const [districtsMap, setDistrictsMap] = useState({});
  const [districts, setDistricts] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    bloodGroup: "",
    division: "", // now holds division name as string
    district: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const divisionRes = await fetch("/divisions.json");
        const divisionJson = await divisionRes.json();

        const divisionsData =
          divisionJson.find(
            (item) => item.type === "table" && item.name === "divisions"
          )?.data || [];
        setDivisions(divisionsData);

        const districtsRes = await fetch("/districts.json");
        const districtsJson = await districtsRes.json();

        const districtsData =
          districtsJson.find(
            (item) => item.type === "table" && item.name === "districts"
          )?.data || [];

        // Build districtsMap keyed by division name instead of ID
        const map = {};
        districtsData.forEach((district) => {
          // Find division name for this district's division_id
          const division = divisionsData.find(
            (d) => String(d.id) === String(district.division_id)
          );
          if (division) {
            const divisionName = division.name;
            if (!map[divisionName]) {
              map[divisionName] = [];
            }
            map[divisionName].push(district.name);
          }
        });
        setDistrictsMap(map);
      } catch (err) {
        console.error("Failed to load divisions or districts:", err);
        toast.error("Failed to load divisions or districts");
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (formData.division && districtsMap[formData.division]) {
      setDistricts(districtsMap[formData.division]);
    } else {
      setDistricts([]);
    }
    // Reset district when division changes
    setFormData((fd) => ({ ...fd, district: "" }));
  }, [formData.division, districtsMap]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024) {
        toast.error("Avatar file size should be less than 100KB");
        return;
      }
      setAvatarUrl("");
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUrlChange = (e) => {
    const url = e.target.value.trim();
    setAvatarUrl(url);
    setAvatarPreview(url || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation regex:
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*)."
      );
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
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
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // Firebase Auth signup
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Save to MongoDB
      const res = await fetch(
        "https://pulse-point-server-blue.vercel.app/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: formData.name,
            avatar: avatarPreview || "",
            bloodGroup: formData.bloodGroup,
            division: formData.division, // sends division name
            district: formData.district,
            role: "donor", // default role
            status: "active",
          }),
        }
      );

      const data = await res.json();

      if (res.ok && !data.message) {
        toast.success("Registration successful!");
        setFormData({
          email: "",
          name: "",
          bloodGroup: "",
          division: "",
          district: "",
          password: "",
          confirm_password: "",
        });
        setAvatarUrl("");
        setAvatarPreview(null);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to save user data.");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-red-600">
        Create Your Donor Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            Avatar (Upload a file or enter image URL)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full text-sm text-gray-500 mb-2"
          />

          <input
            type="url"
            name="avatarUrl"
            placeholder="Or enter avatar image URL"
            value={avatarUrl}
            onChange={handleAvatarUrlChange}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
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
            <option key={d.id} value={d.name}>
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

        {/* Password field with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 hover:bg-red-200 text-gray-700 hover:text-red-600 transition"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Confirm password with toggle */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-200 hover:bg-red-200 text-gray-700 hover:text-red-600 transition"
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded shadow transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-red-600 hover:underline font-medium"
          >
            Login here
          </button>
        </p>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Register;
