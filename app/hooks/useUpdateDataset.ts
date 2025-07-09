import { useState } from "react";

interface UpdateDatasetData {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  categories: string[]; // <-- Add this line
}

interface UseUpdateDatasetReturn {
  updateDataset: (datasetId: number, data: UpdateDatasetData) => Promise<void>;
  isUpdating: boolean;
  error: string | null;
}

export const useUpdateDataset = (): UseUpdateDatasetReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDataset = async (datasetId: number, data: UpdateDatasetData) => {
    setIsUpdating(true);
    setError(null);

    try {
      // Step 1: Update the dataset basic info
      const datasetResponse = await fetch(`/api/datasets/${datasetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          category: data.category,
        }),
      });

      if (!datasetResponse.ok) {
        throw new Error("Failed to update dataset");
      }

      // Step 2: Handle tag relationships
      // First, get current tags for this dataset
      const currentTagsResponse = await fetch(`/api/dataset_tags/${datasetId}`);
      if (!currentTagsResponse.ok) {
        throw new Error("Failed to fetch current tags");
      }
      const currentTags = await currentTagsResponse.json();

      // Get or create new tags
      const newTagIds = await Promise.all(
        data.tags.map(async (tagName) => {
          // Try to find existing tag first
          const existingTagResponse = await fetch(
            `/api/tags?name=${encodeURIComponent(tagName)}`
          );
          if (existingTagResponse.ok) {
            const existingTags = await existingTagResponse.json();
            if (existingTags.length > 0) {
              return existingTags[0].id;
            }
          }

          // Create new tag if it doesn't exist
          const createTagResponse = await fetch("/api/tags", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: tagName }),
          });

          if (!createTagResponse.ok) {
            throw new Error(`Failed to create tag: ${tagName}`);
          }

          const newTag = await createTagResponse.json();
          return newTag.id;
        })
      );

      // Step 2b: Handle category relationships (parallel to tags)
      // First, get current categories for this dataset
      const currentCategoriesResponse = await fetch(
        `/api/dataset_categories/${datasetId}`
      );
      if (!currentCategoriesResponse.ok) {
        throw new Error("Failed to fetch current categories");
      }
      const currentCategories = await currentCategoriesResponse.json();

      // Get or create new categories
      const newCategoryIds = await Promise.all(
        (data.categories || []).map(async (categoryName: string) => {
          // Try to find existing category first
          const existingCategoryResponse = await fetch(
            `/api/categories?name=${encodeURIComponent(categoryName)}`
          );
          if (existingCategoryResponse.ok) {
            const existingCategories = await existingCategoryResponse.json();
            if (existingCategories.length > 0) {
              return existingCategories[0].id;
            }
          }

          // Create new category if it doesn't exist
          const createCategoryResponse = await fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: categoryName }),
          });

          if (!createCategoryResponse.ok) {
            throw new Error(`Failed to create category: ${categoryName}`);
          }

          const newCategory = await createCategoryResponse.json();
          return newCategory.id;
        })
      );

      // Step 3: Determine which relationships to add/remove
      const currentTagIds = currentTags.map(
        (ct: { tag_id: number }) => ct.tag_id
      );
      const tagsToAdd = newTagIds.filter(
        (tagId: number) => !currentTagIds.includes(tagId)
      );
      const tagsToRemove = currentTagIds.filter(
        (tagId: number) => !newTagIds.includes(tagId)
      );

      // Step 3b: Determine which category relationships to add/remove
      const currentCategoryIds = currentCategories.map(
        (cc: { category_id: number }) => cc.category_id
      );
      const categoriesToAdd = newCategoryIds.filter(
        (categoryId: number) => !currentCategoryIds.includes(categoryId)
      );
      const categoriesToRemove = currentCategoryIds.filter(
        (categoryId: number) => !newCategoryIds.includes(categoryId)
      );

      // Step 4: Remove old relationships
      await Promise.all(
        tagsToRemove.map(async (tagId: number) => {
          const deleteResponse = await fetch(
            `/api/dataset_tags/${datasetId}/${tagId}`,
            {
              method: "DELETE",
            }
          );
          if (!deleteResponse.ok) {
            console.warn(`Failed to remove tag relationship: ${tagId}`);
          }
        })
      );

      // Step 4b: Remove old category relationships
      await Promise.all(
        categoriesToRemove.map(async (categoryId: number) => {
          const deleteResponse = await fetch(
            `/api/dataset_categories/${datasetId}/${categoryId}`,
            {
              method: "DELETE",
            }
          );
          if (!deleteResponse.ok) {
            console.warn(
              `Failed to remove category relationship: ${categoryId}`
            );
          }
        })
      );

      // Step 5: Add new relationships
      await Promise.all(
        tagsToAdd.map(async (tagId: number) => {
          const createResponse = await fetch("/api/dataset_tags", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dataset_id: datasetId,
              tag_id: tagId,
            }),
          });
          if (!createResponse.ok) {
            throw new Error(
              `Failed to create tag relationship for tag ID: ${tagId}`
            );
          }
        })
      );

      // Step 5b: Add new category relationships
      await Promise.all(
        categoriesToAdd.map(async (categoryId: number) => {
          const createResponse = await fetch("/api/dataset_categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dataset_id: datasetId,
              category_id: categoryId,
            }),
          });
          if (!createResponse.ok) {
            throw new Error(
              `Failed to create category relationship for category ID: ${categoryId}`
            );
          }
        })
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateDataset,
    isUpdating,
    error,
  };
};
