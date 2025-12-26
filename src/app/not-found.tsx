"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import animation404 from "../../public/empty.json";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
      {/* Lottie Animation */}
      <div className="w-full max-w-md">
        <Lottie animationData={animation404} loop={true} />
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold mt-4 text-gray-800">Page Not Found</h1>

      {/* Description */}
      <p className="text-gray-500 mt-2 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      {/* Button */}
      <Link
        href="/"
        className="mt-6 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
