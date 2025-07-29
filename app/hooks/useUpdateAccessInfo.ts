import { useState } from "react";

interface UseUpdateAccessInfoProps {
  onSuccess?: () => void;
}

export const useUpdateAccessInfo = ({ onSuccess }: UseUpdateAccessInfoProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateAccessInfo = async (dataset_id: number, access_id: string, field: string, value: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/access_info/${dataset_id}/${access_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update access info.");
        return false;
      }

      setSuccess(true);
      onSuccess?.();
      return true;
    } catch (err) {
      setError("Failed to update access info.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    updateAccessInfo,
    loading,
    error,
    success,
    reset,
  };
};