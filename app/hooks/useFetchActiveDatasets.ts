import { useState, useEffect, useCallback } from "react";
import { Dataset } from "../types";

export function useFetchActiveDatasets() {
  const [isLoading, setIsLoading] = useState(true);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const fetchDatasets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/datasets/active");
      const datasetsData = await response.json();

      const datasetsWithTagsAndCategories = await Promise.all(
        datasetsData.map(async (dataset: any) => {
          const tagsResponse = await fetch(`/api/dataset_tags/${dataset.id}`);
          const tagRelations = await tagsResponse.json();
          const tags = tagRelations.map(
            (relation: { name: string }) => relation.name
          );

          const categoriesResponse = await fetch(
            `/api/dataset_categories/${dataset.id}`
          );
          const categoryRelations = await categoriesResponse.json();
          const categories = categoryRelations.map(
            (relation: { name: string }) => relation.name
          );

          return {
            ...dataset,
            tags,
            categories,
          };
        })
      );

      setDatasets(datasetsWithTagsAndCategories);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  return { datasets, isLoading, refetch: fetchDatasets };
}
