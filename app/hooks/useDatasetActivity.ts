import { useState } from "react";

interface UseDatasetActivityResult {
  active: boolean;
  loading: boolean;
  error: string | null;
  toggleActivity: () => Promise<void>;
}

export function useDatasetActivity(
  datasetId: number,
  initialActive: boolean
): UseDatasetActivityResult {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/datasets/${datasetId}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        throw new Error("Failed to update dataset activity");
      }
      const data = await res.json();
      setActive(data.isActive === "T");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { active, loading, error, toggleActivity };
}
