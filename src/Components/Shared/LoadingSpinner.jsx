import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <svg
        className="animate-pulse w-16 h-16 text-red-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.21c-.43 0-.86.2-1.13.58l-5.83 7.93a3.95 3.95 0 00-.91 2.59 3.996 3.996 0 003.99 3.99 3.95 3.95 0 002.59-.91l.06-.06a.75.75 0 011.06 1.06l-.07.07a5.444 5.444 0 01-7.71 0 5.446 5.446 0 010-7.71l5.83-7.93a1.594 1.594 0 012.8 1.22v.02l.01.02a4.163 4.163 0 01.56 1.9.75.75 0 01-1.5 0 2.65 2.65 0 00-.17-.91v-.02z" />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
