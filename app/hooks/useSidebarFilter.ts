import { useState, useCallback, useRef, useEffect } from "react";

interface FilterState {
  categories: Set<string>;
  tags: Set<string>;
}

export const useSidebarFilter = (
  initialCategories: string[],
  initialTags: string[]
) => {
  const isInitialMount = useRef(true);
  const prevInitialCategories = useRef(initialCategories);
  const prevInitialTags = useRef(initialTags);

  const [filterState, setFilterState] = useState<FilterState>(() => ({
    categories: new Set(initialCategories),
    tags: new Set(initialTags),
  }));

  // Only update state when initial props change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevInitialCategories.current = initialCategories;
      prevInitialTags.current = initialTags;
      return;
    }

    // Check if the initial props have actually changed
    const categoriesChanged =
      !initialCategories.every((cat) =>
        prevInitialCategories.current.includes(cat)
      ) ||
      !prevInitialCategories.current.every((cat) =>
        initialCategories.includes(cat)
      );
    const tagsChanged =
      !initialTags.every((tag) => prevInitialTags.current.includes(tag)) ||
      !prevInitialTags.current.every((tag) => initialTags.includes(tag));

    if (categoriesChanged || tagsChanged) {
      setFilterState({
        categories: new Set(initialCategories),
        tags: new Set(initialTags),
      });
      prevInitialCategories.current = initialCategories;
      prevInitialTags.current = initialTags;
    }
  }, [initialCategories, initialTags]);

  const handleFilterChange = useCallback(
    (filterType: "categories" | "tags", value: string) => {
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

  const filterDatasets = useCallback(
    (datasets: any[]) => {
      const filtered = datasets.filter((dataset) => {
        // Category filter
        const matchesCategory = filterState.categories.has(dataset.category);

        // Tag filter - check if any of the dataset's tags are in the selected tags set

        const matchesTags =
          dataset.tags?.some((tag: string) => {
            const matches = filterState.tags.has(tag);
            return matches;
          }) ?? false;

        // Dataset is shown if it matches both category and tag filters
        const shouldShow = matchesCategory && matchesTags;

        return shouldShow;
      });

      return filtered;
    },
    [filterState]
  );

  return {
    filterState,
    handleFilterChange,
    filterDatasets,
  };
};
