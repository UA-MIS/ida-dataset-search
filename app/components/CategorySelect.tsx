"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Select to avoid SSR issues
const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="w-full px-4 py-2 border rounded-lg min-h-[42px] bg-gray-50 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  ),
});

interface CategorySelectProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  categories: string[];
  error?: string;
}

interface Option {
  value: string;
  label: string;
}

const CategorySelect = ({
  value,
  onChange,
  disabled = false,
  categories,
  error,
}: CategorySelectProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert categories to options format
  const options: Option[] = categories.sort().map((category) => ({
    value: category,
    label: category,
  }));

  // Find the selected option
  const selectedOption = options.find((option) => option.value === value);

  const handleChange = (newValue: unknown, actionMeta: any) => {
    const option = newValue as Option | null;
    onChange(option?.value || "");
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="space-y-2">
        <div className="w-full px-4 py-2 border rounded-lg min-h-[42px] bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isDisabled={disabled}
        placeholder="Select a category"
        isClearable={false}
        isSearchable={true}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: "42px",
            borderColor: state.isFocused ? "#dc2626" : "#d1d5db",
            boxShadow: state.isFocused ? "0 0 0 1px #dc2626" : "none",
            backgroundColor: "white",
            "&:hover": {
              borderColor: "#dc2626",
            },
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            padding: "4px",
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#fef2f2" : "white",
            color: state.isFocused ? "#991b1b" : "#374151",
            borderRadius: "4px",
            margin: "1px 0",
            "&:hover": {
              backgroundColor: "#fef2f2",
              color: "#991b1b",
            },
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#374151",
          }),
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CategorySelect;
