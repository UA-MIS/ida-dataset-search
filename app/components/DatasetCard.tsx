import React from "react";
import { FaDownload, FaDatabase, FaGlobe, FaServer } from "react-icons/fa";

interface Props {
  title: string;
  description?: string;
  tags: string[];
  categories: string[];
  type?: string;
  downloads?: number;
  onDownload: () => void;
}

const typeIcon: Record<string, React.ReactNode> = {
  API: <FaGlobe className="h-4 w-4" />,
  Database: <FaDatabase className="h-4 w-4" />,
  FTP: <FaServer className="h-4 w-4" />,
};

const DatasetCard = ({
  title,
  description,
  categories,
  tags,
  type,
  downloads,
  onDownload,
}: Props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {title}
          </h3>
          {type && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium shrink-0">
              {typeIcon[type] || null}
              {type}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {description || "No description available."}
        </p>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map((category) => (
              <span
                key={category}
                className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {downloads !== undefined && (
            <span className="text-xs text-gray-400">
              {downloads} download{downloads !== 1 ? "s" : ""}
            </span>
          )}
          <button
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors"
            onClick={onDownload}
          >
            <FaDownload className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;
