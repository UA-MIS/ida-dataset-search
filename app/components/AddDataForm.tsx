"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TagInput from "./TagInput";
import CategorySelect from "./CategorySelect";
import { categories } from "@/app/constants";
import Toast from "./Toast";
import { Tag } from "../types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.enum(categories as [string, ...string[]], {
    message: "Please select a category",
  }),
});

type FormData = z.infer<typeof formSchema>;

const AddDataForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

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
      category: undefined,
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
          category: data.category,
        }),
      });

      if (!datasetResponse.ok) {
        throw new Error("Failed to create dataset");
      }

      const dataset = await datasetResponse.json();

      // Handle tags: create new ones or use existing ones
      const tagIds = await Promise.all(
        data.tags.map(async (tagName) => {
          // Check if tag already exists
          const existingTag = existingTags.find(
            (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
          );

          if (existingTag) {
            // Use existing tag
            return existingTag.id;
          } else {
            // Create new tag
            const tagResponse = await fetch("/api/tags", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: tagName,
              }),
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
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dataset_id: dataset.id,
              tag_id: tagId,
            }),
          });

          if (!relationshipResponse.ok) {
            throw new Error(
              `Failed to create relationship for tag ID: ${tagId}`
            );
          }
        })
      );

      reset();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
      }, 3000);
      const modal = document.getElementById(
        "add-dataset-modal"
      ) as HTMLDialogElement;
      if (modal) modal.close();
    } catch (error) {
      console.error("Error creating dataset:", error);
      alert("Failed to create dataset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isSuccess && (
        <Toast
          message="Dataset created successfully!"
          color="success"
          duration={3000}
          onClose={() => setIsSuccess(false)}
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
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <CategorySelect
            value={category}
            onChange={(value) => setValue("category", value)}
            disabled={isSubmitting}
            categories={categories}
            error={errors.category?.message}
          />
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
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
      </form>
    </div>
  );
};

export default AddDataForm;
