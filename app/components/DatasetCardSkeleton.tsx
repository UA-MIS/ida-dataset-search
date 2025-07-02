import React from "react";

const DatasetCardSkeleton = () => {
  return (
    <div className="card bg-base-100 card-lg shadow-sm h-full animate-pulse">
      <div className="card-body">
        {/* Title */}
        <div className="h-6 bg-red-100 rounded w-3/4 mb-2"></div>

        {/* Category */}
        <div className="h-4 bg-red-50 rounded w-1/3 mb-2"></div>

        {/* Tags */}
        <div className="h-4 bg-red-50 rounded w-2/3 mb-4"></div>

        {/* Description lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-red-50 rounded w-full"></div>
          <div className="h-4 bg-red-50 rounded w-5/6"></div>
          <div className="h-4 bg-red-50 rounded w-4/6"></div>
          <div className="h-4 bg-red-50 rounded w-3/6"></div>
          <div className="h-4 bg-red-50 rounded w-full"></div>
          <div className="h-4 bg-red-50 rounded w-5/6"></div>
          <div className="h-4 bg-red-50 rounded w-4/6"></div>
          <div className="h-4 bg-red-50 rounded w-3/6"></div>
          <div className="h-4 bg-red-50 rounded w-full"></div>
          <div className="h-4 bg-red-50 rounded w-5/6"></div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <div className="h-10 bg-red-100 rounded w-20"></div>
          <div className="h-10 bg-red-100 rounded w-20"></div>
          <div className="h-10 bg-red-100 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default DatasetCardSkeleton;
