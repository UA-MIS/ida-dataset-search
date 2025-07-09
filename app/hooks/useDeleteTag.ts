import { useState } from "react";

export const useDeleteTag = (onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteTag = async (tag_id: number) => {
    setIsDeleting(true);
    setError(null);
    setIsSuccess(false);

    try {
      console.log(`Attempting to delete tag ${tag_id}`);

      const response = await fetch(`/api/tags/${tag_id}`, {
        method: "DELETE",
      });

      console.log(`Delete response status: ${response.status}`);

      if (!response.ok) {
        const data = await response.json();
        console.error("Delete failed:", data);
        throw new Error(data.error || "Failed to delete tag");
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

  return { deleteTag, isDeleting, error, isSuccess };
};
