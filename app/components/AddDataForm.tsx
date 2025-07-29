"use client";
import React, { useEffect, useState } from "react";
import TagInput from "./TagInput";
import CategoryInput from "./CategoryInput";
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

interface AddDataFormValue {
  type: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  [key: string]: any;
}

interface AddDataFormProps {
  value?: AddDataFormValue;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
  error?: string | null;
  loading?: boolean;
  tags?: string[];
  categories?: string[];
  existingTags?: string[];
  existingCategories?: string[];
}

const defaultValue: AddDataFormValue = {
  type: "",
  title: "",
  description: "",
  categories: [],
  tags: [],
};

const AddDataForm: React.FC<AddDataFormProps> = ({
  value = defaultValue,
  onChange,
  disabled,
  existingTags: propTags,
  existingCategories: propCategories,
}) => {
  const [localTags, setLocalTags] = useState<{ id: number; name: string }[]>(
    (propTags || []).map((t, i) => ({ id: i, name: t }))
  );
  const [existingCategories, setExistingCategories] = useState<string[]>(
    propCategories || []
  );
  const [isLoadingTags, setIsLoadingTags] = useState(!propTags);
  const [isLoadingCategories, setIsLoadingCategories] = useState(
    !propCategories
  );

  useEffect(() => {
    if (propTags) {
      setLocalTags(propTags.map((t, i) => ({ id: i, name: t })));
      setIsLoadingTags(false);
      return;
    }
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const tags = await response.json();
          setLocalTags(
            tags.map((t: string, i: number) => ({ id: i, name: t }))
          );
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };
    fetchTags();
  }, [propTags]);

  useEffect(() => {
    if (propCategories) {
      setExistingCategories(propCategories);
      setIsLoadingCategories(false);
      return;
    }
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const cats = await response.json();
          setExistingCategories(cats.map((c: any) => c.name));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [propCategories]);

  // Ensure value.type is always a string
  const typeValue = typeof value?.type === "string" ? value.type : "";

  // For react-select, always use an option object for value
  const typeOptions = [
    { label: "API", value: "API" },
    { label: "FTP", value: "FTP" },
    { label: "Database", value: "Database" },
  ];
  const selectedType =
    typeOptions.find((opt) => opt.value === typeValue) || null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter dataset title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
            disabled={disabled}
            value={value?.title ?? ""}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter dataset description"
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
            disabled={disabled}
            value={value?.description ?? ""}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <div className="space-y-2">
            <Select
              id="type"
              isDisabled={disabled}
              options={typeOptions}
              value={selectedType}
              onChange={(option: any) => onChange("type", option?.value || "")}
              placeholder="Select data type..."
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
              Select the type of data source for this dataset
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="categories" className="block text-sm font-medium">
            Categories
          </label>
          <CategoryInput
            categories={value?.categories ?? []}
            onChange={(newCategories) => onChange("categories", newCategories)}
            disabled={disabled}
            existingCategories={existingCategories}
            isLoading={isLoadingCategories}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags</label>
          <TagInput
            tags={value?.tags ?? []}
            onChange={(newTags) => onChange("tags", newTags)}
            disabled={disabled}
            existingTags={localTags}
            isLoading={isLoadingTags}
          />
        </div>
      </div>
    </div>
  );
};

export default AddDataForm;
