"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TagInput from "./TagInput";
import CategorySelect from "./CategorySelect";
import Toast from "./Toast";
import { useUpdateDataset } from "../hooks/useUpdateDataset";
import { Dataset, Tag } from "../types";
import { categories } from "@/app/constants";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.enum(categories as [string, ...string[]], {
    message: "Please select a category",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  dataset: Dataset;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditDatasetForm = ({ dataset, onSuccess, onCancel }: Props) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const { updateDataset, isUpdating, error } = useUpdateDataset();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: dataset.title,
      description: "", // We'll need to fetch this from the API
      tags: dataset.tags || [],
      category: dataset.category as any,
    },
  });

  const tags = watch("tags");
  const category = watch("category");

  // Fetch existing tags on component mount
  useEffect(() => {
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
  }, []);

  // Fetch the full dataset data including description when component mounts
  useEffect(() => {
    const fetchDatasetDetails = async () => {
      try {
        const response = await fetch(`/api/datasets/${dataset.id}`);
        if (response.ok) {
          const fullDataset = await response.json();
          setValue("description", fullDataset.description || "");
        }
      } catch (error) {
        console.error("Failed to fetch dataset details:", error);
      }
    };

    fetchDatasetDetails();
  }, [dataset.id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateDataset(dataset.id, data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error("Error updating dataset:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isSuccess && (
        <Toast
          message="Dataset updated successfully!"
          color="success"
          duration={3000}
          onClose={() => setIsSuccess(false)}
        />
      )}

      {error && (
        <Toast
          message={`Error: ${error}`}
          color="error"
          duration={5000}
          onClose={() => {}}
        />
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            id="title"
            placeholder="Enter dataset title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            disabled={isUpdating}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            {...register("description")}
            id="description"
            placeholder="Enter dataset description"
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            disabled={isUpdating}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <CategorySelect
            value={category}
            onChange={(value) => setValue("category", value)}
            disabled={isUpdating}
            categories={categories}
            error={errors.category?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags</label>
          <TagInput
            tags={tags}
            onChange={(newTags) => setValue("tags", newTags)}
            disabled={isUpdating}
            existingTags={existingTags}
            isLoading={isLoadingTags}
          />
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating Dataset...</span>
              </div>
            ) : (
              "Update Dataset"
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isUpdating}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditDatasetForm;
