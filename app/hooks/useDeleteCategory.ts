import { useState } from "react";

export const useDeleteCategory = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteCategory = async (category_id: number) => {
    setIsDeleting(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log(`Attempting to delete category ${category_id}`);

      const response = await fetch(`/api/categories/${category_id}`, {
        method: "DELETE",
      });

      console.log(`Delete response status: ${response.status}`);

      if (!response.ok) {
        const data = await response.json();
        console.error("Delete failed:", data);
        throw new Error(data.error || "Failed to delete category");
      }

      const result = await response.json();
      console.log("Delete successful:", result);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.(); // Call the success callback to refresh the page
      }, 3000); // Reset success message after 3 seconds
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Delete error:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCategory, isDeleting, error, isSuccess };
};
