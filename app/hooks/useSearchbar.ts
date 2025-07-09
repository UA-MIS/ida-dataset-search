import { useState, useCallback, useEffect } from "react";

export function useSearchbar<T extends Record<string, any>>(
  items: T[],
  key: keyof T = "name"
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setFilteredItems(items);
        return;
      }
      const filtered = items.filter((item) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      });
      setFilteredItems(filtered);
    },
    [items, key]
  );

  return {
    searchQuery,
    filteredItems,
    handleSearch,
  };
}
