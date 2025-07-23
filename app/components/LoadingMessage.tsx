import React from "react";

interface LoadingMessageProps {
  message?: string;
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-6">
        <span className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-red-100 items-center justify-center">
            <svg
              className="w-8 h-8 text-red-700 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        </span>
      </div>
      <div className="text-lg font-semibold text-red-800 mb-2 animate-pulse">
        {message}
      </div>
      <div className="text-gray-500 text-sm">
        Please wait while we fetch your data.
      </div>
    </div>
  );
};

export default LoadingMessage;
