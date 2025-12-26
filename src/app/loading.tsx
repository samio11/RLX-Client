"use client";

import Lottie from "lottie-react";
import loadingAnimation from "../../public/Loading.json";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="w-40 h-40">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
}
