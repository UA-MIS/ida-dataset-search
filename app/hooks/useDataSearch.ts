import { useState, useEffect } from "react";
import { categories } from "../constants";
import { Dataset } from "../types";

export const useDataSearch = (datasets: Dataset[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);
  const [isResults, setIsResults] = useState(true);

  const filterDatasets = (search: string, tag: string, category: string) => {
    const filtered = datasets.filter((dataset) => {
      const matchesSearch = dataset.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTag = !tag || (dataset.tags && dataset.tags.includes(tag));
      const matchesCategory = !category || dataset.category === category;
      return matchesSearch && matchesTag && matchesCategory;
    });
    setFilteredDatasets(filtered);
    setIsResults(filtered.length > 0);
  };

  useEffect(() => {
    if (datasets.length > 0) {
      setFilteredDatasets(datasets);
      setIsResults(true);
    }
  }, [datasets]);

  useEffect(() => {
    if (datasets.length > 0) {
      filterDatasets(searchQuery, selectedTag, selectedCategory);
    }
  }, [searchQuery, selectedTag, selectedCategory, datasets]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (selectedOption: string) => {
    if (selectedOption === "") {
      setSelectedTag("");
      setSelectedCategory("");
      return;
    }

    if (datasets.some((dataset) => dataset.tags?.includes(selectedOption))) {
      setSelectedTag(selectedOption);
    } else if (categories.includes(selectedOption)) {
      setSelectedCategory(selectedOption);
    }
  };

  return {
    filteredDatasets,
    isResults,
    handleSearch,
    handleFilterChange,
    searchQuery,
    selectedTag,
    selectedCategory,
    setSearchQuery,
    setSelectedTag,
    setSelectedCategory,
  };
};
