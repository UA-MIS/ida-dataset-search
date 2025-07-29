import { useState, useEffect } from "react";

interface AdminOverview {
  datasets: number;
  active_datasets: number;
  total_downloads: number;
  users: number;
  tags: number;
  categories: number;
}

export function useFetchAdminOverview() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch("/api/admin/overview");
        const data = await response.json();
        setOverview(data);
      } catch (error) {
        console.error("Error fetching overview:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);

  return { overview, isLoading };
}
