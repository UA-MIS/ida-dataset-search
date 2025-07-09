import { useState } from "react";

interface UseUpdateCategoryProps {
  onSuccess?: () => void;
}

export const useUpdateCategory = ({ onSuccess }: UseUpdateCategoryProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateCategory = async (categoryId: string, name: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update category.");
        return false;
      }

      setSuccess(true);
      onSuccess?.();
      return true;
    } catch (err) {
      setError("Failed to update category.");
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
    updateCategory,
    loading,
    error,
    success,
    reset,
  };
};
