import React from "react";

interface NoResultsMessageProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const NoResultsMessage = ({
  title = "No Results Found",
  message = "We couldn't find any items matching your search criteria. Try adjusting your search terms or filters.",
  icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-16 h-16"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  ),
}: NoResultsMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-red-300">{icon}</div>
      <h3 className="text-xl font-bold text-red-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md">{message}</p>
    </div>
  );
};

export default NoResultsMessage;
