import { useState } from "react";

interface UseUpdateTagProps {
  onSuccess?: () => void;
}

export const useUpdateTag = ({ onSuccess }: UseUpdateTagProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateTag = async (tagId: string, name: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update tag.");
        return false;
      }

      setSuccess(true);
      onSuccess?.();
      return true;
    } catch (err) {
      setError("Failed to update tag.");
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
    updateTag,
    loading,
    error,
    success,
    reset,
  };
};
