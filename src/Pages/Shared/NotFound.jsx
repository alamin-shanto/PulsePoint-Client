import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto mb-6 w-24 h-24 text-red-600 animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle
            cx="32"
            cy="32"
            r="30"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 20l24 24M44 20L20 44"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>

        <h1 className="text-6xl font-extrabold text-red-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-red-800">
          Oops! Page Not Found
        </h2>
        <p className="text-red-600 mb-6">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow-lg hover:bg-red-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
