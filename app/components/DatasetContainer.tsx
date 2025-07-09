import React from "react";

interface Props {
  id: number;
  title: string;
  tags: string[];
  categories: string[];
}

const DatasetContainer = ({ id, title, tags, categories }: Props) => {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="card-body p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-xl font-bold text-gray-800 hover:text-red-600 transition-colors duration-200">
            {title}
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="badge badge-outline badge-error font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Researcher</p>
              <p className="font-medium">John Doe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Organization</p>
              <p className="font-medium">ABC Org</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="font-medium">2025-01-01</p>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-4">
          <p className="text-gray-600 line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="badge badge-primary bg-red-100 text-red-700 border-red-200 hover:bg-red-200 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end">
          <button className="btn btn-sm btn-outline btn-error hover:btn-error hover:text-white transition-all duration-200">
            View Dataset
          </button>
          <button className="btn btn-sm btn-error text-white">Download</button>
        </div>
      </div>
    </div>
  );
};

export default DatasetContainer;
