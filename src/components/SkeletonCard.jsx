import React from "react";

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-md p-4 border rounded-xl shadow bg-white animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

