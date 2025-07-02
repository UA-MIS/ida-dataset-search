import { useState, useCallback, useEffect } from "react";
import { Dataset } from "../types";

export const useSearchbar = (datasets: Dataset[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);

  // Initialize filtered datasets when datasets prop changes
  useEffect(() => {
    setFilteredDatasets(datasets);
  }, [datasets]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredDatasets(datasets);
        return;
      }

      const filtered = datasets.filter((dataset) => {
        const matchesSearch = dataset.title
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesSearch;
      });

      setFilteredDatasets(filtered);
    },
    [datasets]
  );

  return {
    searchQuery,
    filteredDatasets,
    handleSearch,
  };
};
