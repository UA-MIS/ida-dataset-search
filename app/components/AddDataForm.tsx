"use client";
import React, { useEffect, useState } from "react";
import TagInput from "./TagInput";
import CategoryInput from "./CategoryInput";
import { Dataset, Tag } from "../types";

interface AddDataFormProps {
  value: Omit<Dataset, "id">;
  onChange: (field: keyof Omit<Dataset, "id">, value: any) => void;
  disabled?: boolean;
  existingTags?: Tag[];
  existingCategories?: string[];
}

const AddDataForm: React.FC<AddDataFormProps> = ({
  value,
  onChange,
  disabled,
  existingTags: propTags,
  existingCategories: propCategories,
}) => {
  const [existingTags, setExistingTags] = useState<Tag[]>(propTags || []);
  const [existingCategories, setExistingCategories] = useState<string[]>(
    propCategories || []
  );
  const [isLoadingTags, setIsLoadingTags] = useState(!propTags);
  const [isLoadingCategories, setIsLoadingCategories] = useState(
    !propCategories
  );

  useEffect(() => {
    if (propTags) {
      setExistingTags(propTags);
      setIsLoadingTags(false);
      return;
    }
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const tags = await response.json();
          setExistingTags(tags);
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
            value={value.title}
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
            value={value.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <input
            type="text"
            id="type"
            placeholder="Enter dataset type"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
            disabled={disabled}
            value={value.type}
            onChange={(e) => onChange("type", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="categories" className="block text-sm font-medium">
            Categories
          </label>
          <CategoryInput
            categories={value.categories}
            onChange={(newCategories) => onChange("categories", newCategories)}
            disabled={disabled}
            existingCategories={existingCategories}
            isLoading={isLoadingCategories}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags</label>
          <TagInput
            tags={value.tags}
            onChange={(newTags) => onChange("tags", newTags)}
            disabled={disabled}
            existingTags={existingTags}
            isLoading={isLoadingTags}
          />
        </div>
      </div>
    </div>
  );
};

export default AddDataForm;
