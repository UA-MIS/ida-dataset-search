import React from "react";

interface SuccessMessageProps {
  message: string;
  subMessage?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  subMessage,
}) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="text-green-600 mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
    <div className="text-lg font-semibold text-green-700 mb-2">{message}</div>
    {subMessage && <div className="text-gray-500 text-sm">{subMessage}</div>}
  </div>
);

export default SuccessMessage;
