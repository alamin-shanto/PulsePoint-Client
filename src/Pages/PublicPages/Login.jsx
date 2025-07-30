import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../../Firebase/firebase.config";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseToken = await userCredential.user.getIdToken();

      const jwtResponse = await fetch(
        "https://pulse-point-server-blue.vercel.app/jwt",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
          },
        }
      );

      if (!jwtResponse.ok) throw new Error("Failed to get backend JWT token");

      const { token: backendJwt } = await jwtResponse.json();

      localStorage.setItem("firebaseToken", firebaseToken);
      localStorage.setItem("backendJwt", backendJwt);

      const response = await fetch(
        `https://pulse-point-server-blue.vercel.app/users/${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${backendJwt}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Failed to fetch user info from server");

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.code === "auth/user-not-found"
            ? "User not found. Please register first."
            : error.code === "auth/wrong-password"
            ? "Wrong password. Try again."
            : error.message || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-100 to-pink-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Login to BloodLink
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[38px] text-gray-600 hover:text-red-600"
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
