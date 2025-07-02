import React from "react";

const DatasetSkeleton = () => {
  return (
    <div className="px-20 py-2 animate-pulse">
      <div className="h-8 bg-red-100 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-red-50 rounded w-full"></div>
        <div className="h-4 bg-red-50 rounded w-5/6"></div>
        <div className="h-4 bg-red-50 rounded w-4/6"></div>
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-6 bg-red-100 rounded w-1/4"></div>
        <div className="h-6 bg-red-100 rounded w-1/4"></div>
        <div className="h-6 bg-red-100 rounded w-1/4"></div>
      </div>
      <div className="mt-4">
        <div className="h-6 bg-red-100 rounded w-1/6 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-red-100 rounded-full w-20"></div>
          <div className="h-8 bg-red-100 rounded-full w-24"></div>
          <div className="h-8 bg-red-100 rounded-full w-16"></div>
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <div className="h-10 bg-red-100 rounded w-32"></div>
        <div className="h-10 bg-red-100 rounded w-32"></div>
      </div>
      <div className="divider divider-neutral"></div>
    </div>
  );
};

export default DatasetSkeleton;
