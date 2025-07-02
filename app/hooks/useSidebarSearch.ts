import { useState, useCallback, useEffect } from "react";

export const useSidebarSearch = (options: string[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // Initialize filtered options when options change
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredOptions(options);
        return;
      }

      const filtered = options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    },
    [options]
  );

  return {
    searchQuery,
    filteredOptions,
    handleSearch,
  };
};
