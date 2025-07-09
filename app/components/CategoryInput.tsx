"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import CreatableSelect to avoid SSR issues
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
  loading: () => (
    <div className="w-full px-4 py-2 border rounded-lg min-h-[42px] bg-gray-50 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  ),
});

interface CategoryInputProps {
  categories: string[];
  onChange: (categories: string[]) => void;
  disabled?: boolean;
  existingCategories?: string[];
  isLoading?: boolean;
}

interface Option {
  value: string;
  label: string;
  isNew?: boolean;
}

const CategoryInput = ({
  categories,
  onChange,
  disabled = false,
  existingCategories = [],
  isLoading = false,
}: CategoryInputProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert existing categories to options format
  const existingOptions: Option[] = existingCategories.map((category) => ({
    value: category,
    label: category,
  }));

  // Convert current categories to options format
  const selectedOptions: Option[] = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const handleChange = (newValue: any) => {
    const newCategories = newValue
      ? newValue.map((option: Option) => option.value)
      : [];
    onChange(newCategories);
  };

  const createOption = (inputValue: string): Option => ({
    value: inputValue,
    label: `Create "${inputValue}"`,
    isNew: true,
  });

  const handleCreate = (inputValue: string) => {
    const newOption = createOption(inputValue);
    onChange([...categories, newOption.value]);
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="space-y-2">
        <div className="w-full px-4 py-2 border rounded-lg min-h-[42px] bg-gray-50 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <p className="text-sm text-gray-500">Loading category selector...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <CreatableSelect
        isMulti
        isClearable
        isDisabled={disabled || isLoading}
        isLoading={isLoading}
        value={selectedOptions}
        onChange={handleChange}
        onCreateOption={handleCreate}
        options={existingOptions}
        placeholder="Select or create categories..."
        noOptionsMessage={() => "No categories found"}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
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
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            borderRadius: "6px",
            margin: "2px",
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: "#991b1b",
            padding: "2px 6px",
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: "#dc2626",
            borderRadius: "0 6px 6px 0",
            "&:hover": {
              backgroundColor: "#fecaca",
              color: "#991b1b",
            },
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
          input: (provided) => ({
            ...provided,
            color: "#374151",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#374151",
          }),
        }}
      />
      <p className="text-sm text-gray-500">
        Type to search existing categories or create new ones
      </p>
    </div>
  );
};

export default CategoryInput;
