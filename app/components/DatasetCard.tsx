import React from "react";
import { FaUser, FaBuilding, FaCalendarAlt } from "react-icons/fa";

interface Props {
  title: string;
  description?: string;
  tags: string[];
  categories: string[];
  onDownload: () => void;
}

const DatasetCard = ({
  title,
  description,
  categories,
  tags,
  onDownload,
}: Props) => {
  return (
    <div className="card bg-base-100 card-lg shadow-sm h-full hover:shadow-lg transition-shadow duration-300">
      <div className="card-body p-6">
        {/* Title */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="card-title text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            {title}
          </h2>
        </div>
        {/* Metadata */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FaUser className="h-4 w-4 text-red-600" />
            <span className="text-xs text-gray-500">Researcher</span>
            <span className="font-medium text-sm">John Doe</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBuilding className="h-4 w-4 text-red-600" />
            <span className="text-xs text-gray-500">Organization</span>
            <span className="font-medium text-sm">ABC Org</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="h-4 w-4 text-red-600" />
            <span className="text-xs text-gray-500">Published</span>
            <span className="font-medium text-sm">2025-01-01</span>
          </div>
        </div>
        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {description ||
              "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis."}
          </p>
        </div>
        {/* Categories & Tags */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2">
              Categories:
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 mr-2">
              Tags:
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Download Button */}
        <div className="flex justify-end">
          <button className="btn btn-outline btn-info" onClick={onDownload}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;
