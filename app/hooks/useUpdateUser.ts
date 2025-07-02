import { useState } from "react";

interface UpdateUserData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export function useUpdateUser() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateUser = async (userId: number, userData: UpdateUserData) => {
    setIsUpdating(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      setIsSuccess(true);
      return await response.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateUser, isUpdating, error, isSuccess };
}
