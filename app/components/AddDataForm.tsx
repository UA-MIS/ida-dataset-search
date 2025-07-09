"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TagInput from "./TagInput";
import CategoryInput from "./CategoryInput";
import Toast from "./Toast";
import { Tag } from "../types";
import SuccessMessage from "./SuccessMessage";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
});

type FormData = z.infer<typeof formSchema>;

const AddDataForm = ({
  onSuccess,
  modalId,
}: {
  onSuccess?: () => void;
  modalId?: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

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
      title: "",
      description: "",
      tags: [],
      categories: [],
    },
  });

  const tags = watch("tags");
  const categories = watch("categories");

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Cancel function to close modal
  const handleCancel = () => {
    if (modalId) {
      const modal = document.getElementById(modalId) as HTMLDialogElement;
      modal?.close();
    }
    reset();
  };

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

  // Fetch existing categories on component mount
  useEffect(() => {
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
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const datasetResponse = await fetch("/api/datasets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
      });

      if (!datasetResponse.ok) {
        throw new Error("Failed to create dataset");
      }

      const dataset = await datasetResponse.json();

      // Handle tags: create new ones or use existing ones
      const tagIds = await Promise.all(
        data.tags.map(async (tagName) => {
          const existingTag = existingTags.find(
            (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
          );
          if (existingTag) {
            return existingTag.id;
          } else {
            const tagResponse = await fetch("/api/tags", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: tagName }),
            });
            if (!tagResponse.ok) {
              throw new Error(`Failed to create tag: ${tagName}`);
            }
            const newTag = await tagResponse.json();
            return newTag.id;
          }
        })
      );

      // Create dataset-tag relationships
      await Promise.all(
        tagIds.map(async (tagId: number) => {
          const relationshipResponse = await fetch("/api/dataset_tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_id: dataset.id, tag_id: tagId }),
          });
          if (!relationshipResponse.ok) {
            throw new Error(
              `Failed to create relationship for tag ID: ${tagId}`
            );
          }
        })
      );

      // Handle categories: create new ones or use existing ones
      const categoryIds = await Promise.all(
        data.categories.map(async (categoryName) => {
          // Check if category already exists
          const existingCategory = existingCategories.find(
            (cat) => cat.toLowerCase() === categoryName.toLowerCase()
          );
          if (existingCategory) {
            // Fetch the category to get its id
            const response = await fetch(
              `/api/categories?name=${encodeURIComponent(categoryName)}`
            );
            if (response.ok) {
              const [cat] = await response.json();
              return cat.id;
            }
          } else {
            // Create new category
            const categoryResponse = await fetch("/api/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: categoryName }),
            });
            if (!categoryResponse.ok) {
              throw new Error(`Failed to create category: ${categoryName}`);
            }
            const newCategory = await categoryResponse.json();
            return newCategory.id;
          }
        })
      );

      // Create dataset-category relationships
      await Promise.all(
        categoryIds.map(async (categoryId: number) => {
          const relationshipResponse = await fetch("/api/dataset_categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataset_id: dataset.id,
              category_id: categoryId,
            }),
          });
          if (!relationshipResponse.ok) {
            throw new Error(
              `Failed to create relationship for category ID: ${categoryId}`
            );
          }
        })
      );

      reset();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error creating dataset:", error);
      alert("Failed to create dataset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message if successful
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <SuccessMessage
          message="Dataset created successfully!"
          subMessage="Refreshing page..."
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="categories" className="block text-sm font-medium">
            Categories
          </label>
          <CategoryInput
            categories={categories}
            onChange={(newCategories) => setValue("categories", newCategories)}
            disabled={isSubmitting}
            existingCategories={existingCategories}
            isLoading={isLoadingCategories}
          />
          {errors.categories && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categories.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags</label>
          <TagInput
            tags={tags}
            onChange={(newTags) => setValue("tags", newTags)}
            disabled={isSubmitting}
            existingTags={existingTags}
            isLoading={isLoadingTags}
          />
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          {modalId && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative ${
              modalId ? "flex-1" : "w-full"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Dataset...</span>
              </div>
            ) : (
              "Add Dataset"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDataForm;
