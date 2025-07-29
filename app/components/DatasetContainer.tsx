import React from "react";
import { FaUser, FaBuilding, FaCalendarAlt, FaDownload } from "react-icons/fa";
import { tagColorSets, categoryColorSets } from "../constants";

interface Props {
  title: string;
  tags: string[];
  categories: string[];
  onEditDataset: () => void;
  onEditAccessInfo: () => void;
  active: boolean;
  onActivate: () => void;
}

// Helper to get a random color set from an array
const getRandomColorSet = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const DatasetContainer = ({
  title,
  tags,
  categories,
  onEditDataset,
  onEditAccessInfo,
  active,
  onActivate,
}: Props) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="card-body p-6">
        {/* Title Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="card-title text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
            {title}
          </h2>
          <span
            className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border ${
              active
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Tabular Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* Metadata Column */}
          <div className="flex flex-col gap-4 justify-between">
            <div className="flex items-center gap-2">
              <FaUser className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-xs text-gray-500">Researcher</p>
                <p className="font-medium text-sm">John Doe</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-xs text-gray-500">Organization</p>
                <p className="font-medium text-sm">ABC Org</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-xs text-gray-500">Published</p>
                <p className="font-medium text-sm">2025-01-01</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaDownload className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-xs text-gray-500">Downloads</p>
                <p className="font-medium text-sm">123</p>
              </div>
            </div>
          </div>

          {/* Description Column */}
          <div className="flex flex-col justify-center border-l border-gray-100 pl-4">
            <p className="text-gray-600 text-sm line-clamp-5">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
              urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
              egestas. Iaculis massa nisl malesuada
            </p>
          </div>

          {/* Categories & Tags Column */}
          <div className="flex flex-col gap-4 border-l border-gray-100 pl-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Categories
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((category: string, idx: number) => {
                  const colorSet = getRandomColorSet(categoryColorSets);
                  return (
                    <span
                      key={category + idx}
                      className={`badge badge-outline font-medium ${colorSet.border} ${colorSet.text} ${colorSet.hover} transition-colors duration-200`}
                    >
                      {category}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, idx: number) => {
                  const colorSet = getRandomColorSet(tagColorSets);
                  return (
                    <span
                      key={tag + idx}
                      className={`badge badge-primary font-medium ${colorSet.bg} ${colorSet.text} ${colorSet.border} ${colorSet.hover} transition-colors duration-200`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions Column */}
          <div className="flex flex-col items-end justify-between gap-4 border-l border-gray-100 pl-4">
            <button
              className="btn btn-sm btn-outline btn-warning w-full"
              onClick={onEditDataset}
            >
              Edit Dataset
            </button>
            <button
              className="btn btn-sm btn-outline btn-info w-full"
              onClick={onEditAccessInfo}
            >
              Edit Access Info
            </button>
            {active ? (
              <button
                className="btn btn-sm btn-outline btn-error w-full"
                onClick={onActivate}
              >
                Deactivate
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline btn-success w-full"
                onClick={onActivate}
              >
                Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetContainer;
