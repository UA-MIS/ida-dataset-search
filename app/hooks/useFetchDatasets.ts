import { useState, useEffect, useCallback } from "react";
import { Dataset } from "../types";

export function useFetchDatasets() {
  const [isLoading, setIsLoading] = useState(true);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const fetchDatasets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/datasets");
      const datasetsData = await response.json();

      const datasetsWithTags = await Promise.all(
        datasetsData.map(async (dataset: any) => {
          const tagsResponse = await fetch(`/api/dataset_tags/${dataset.id}`);
          const tagRelations = await tagsResponse.json();

          const tags = tagRelations.map(
            (relation: { name: string }) => relation.name
          );

          return {
            ...dataset,
            tags,
          };
        })
      );

      setDatasets(datasetsWithTags);
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
