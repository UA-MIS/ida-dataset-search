import { useState, useCallback, useEffect, useRef } from "react";

interface FilterState {
  categories: Set<string>;
  tags: Set<string>;
}

export const useSidebarFilter = (
  initialCategories: string[],
  initialTags: string[]
) => {
  const [filterState, setFilterState] = useState<FilterState>(() => ({
    categories: new Set(initialCategories),
    tags: new Set(initialTags),
  }));

  // Track if the user has interacted with the filters
  const userInteracted = useRef(false);

  const handleFilterChange = useCallback(
    (filterType: "categories" | "tags", value: string) => {
      userInteracted.current = true; // Mark as user interaction
      setFilterState((prev) => {
        const newState = { ...prev };
        const currentSet = new Set(newState[filterType]);

        if (currentSet.has(value)) {
          currentSet.delete(value);
        } else {
          currentSet.add(value);
        }

        newState[filterType] = currentSet;
        return newState;
      });
    },
    []
  );

  // If options go from empty to non-empty, and user hasn't interacted, select all by default
  useEffect(() => {
    if (!userInteracted.current) {
      if (initialCategories.length > 0 && filterState.categories.size === 0) {
        setFilterState((prev) => ({
          ...prev,
          categories: new Set(initialCategories),
        }));
      }
      if (initialTags.length > 0 && filterState.tags.size === 0) {
        setFilterState((prev) => ({
          ...prev,
          tags: new Set(initialTags),
        }));
      }
    }
    // eslint-disable-next-line
  }, [initialCategories, initialTags]);

  const filterDatasets = useCallback(
    (datasets: any[]) => {
      return datasets.filter((dataset) => {
        // If no categories selected, hide all
        if (initialCategories.length > 0 && filterState.categories.size === 0)
          return false;
        // If no tags selected, hide all
        if (initialTags.length > 0 && filterState.tags.size === 0) return false;

        // Category filter: show if dataset has at least one selected category, or all are selected
        const matchesCategory =
          filterState.categories.size === initialCategories.length ||
          (dataset.categories &&
            dataset.categories.some((cat: string) =>
              filterState.categories.has(cat)
            ));

        // Tag filter: show if dataset has at least one selected tag, or all are selected
        const matchesTags =
          filterState.tags.size === initialTags.length ||
          (dataset.tags &&
            dataset.tags.some((tag: string) => filterState.tags.has(tag)));

        return matchesCategory && matchesTags;
      });
    },
    [filterState, initialCategories.length, initialTags.length]
  );

  return {
    filterState,
    handleFilterChange,
    filterDatasets,
  };
};
