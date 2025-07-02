import { useState } from "react";

export function useDeleteUser() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const deleteUser = async (userId: number) => {
    setIsDeleting(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setIsSuccess(true);
      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteUser, isDeleting, error, isSuccess };
}
