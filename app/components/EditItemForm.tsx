import React, { useState, useEffect } from "react";
// import { useUpdateTag } from "@/app/hooks/useUpdateTag";
import SuccessMessage from "@/app/components/SuccessMessage";
import { Tag } from "@/app/types";

interface EditItemFormProps {
  item: Tag; // You may want to generalize this type if you have a Category type
  itemType: "tag" | "category";
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Plural mapping for API endpoints
const apiPlural = {
  tag: "tags",
  category: "categories",
};

// Simple Levenshtein distance implementation
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + 1
            );
    }
  }
  return matrix[a.length][b.length];
}

function capitalize(str: string | undefined | null) {
  if (typeof str !== "string" || !str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const EditItemForm: React.FC<EditItemFormProps> = ({
  item,
  itemType,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(item.name);
  const [items, setItems] = useState<Tag[]>([]); // Generalize if you have a Category type
  const [validationError, setValidationError] = useState<string | null>(null);

  // Dynamically import the correct update hook
  const useUpdateTag = require("@/app/hooks/useUpdateTag").useUpdateTag;
  const useUpdateCategory =
    require("@/app/hooks/useUpdateCategory").useUpdateCategory;

  const updateHook = itemType === "tag" ? useUpdateTag : useUpdateCategory;
  const updateKey = itemType === "tag" ? "updateTag" : "updateCategory";

  const hookResult = updateHook({
    onSuccess: () => {
      setTimeout(() => {
        onSuccess?.();
      }, 1800);
    },
  });

  const updateItem = hookResult[updateKey];
  const { loading, error, success, reset } = hookResult;

  useEffect(() => {
    fetch(`/api/${apiPlural[itemType]}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, [itemType]);

  const validateName = (itemName: string): string | null => {
    if (!itemName.trim()) {
      return `${capitalize(itemType)} name is required.`;
    }

    // Check for duplicates (case-insensitive), excluding the current item
    const lowerName = itemName.trim().toLowerCase();
    const duplicate = items.find(
      (i) => i.id !== item.id && i.name.toLowerCase() === lowerName
    );
    if (duplicate) {
      return `A ${itemType} with this name already exists.`;
    }

    // Fuzzy match: if any item is very close (distance <= 2), block
    const fuzzyMatch = items.find(
      (i) =>
        i.id !== item.id && levenshtein(i.name.toLowerCase(), lowerName) <= 2
    );
    if (fuzzyMatch) {
      return `Did you mean '${fuzzyMatch.name}'? Please check for typos or duplicates.`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    reset();

    const validationError = validateName(name);
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    const success = await updateItem(item.id.toString(), name.trim());
    if (success) {
      // Success is handled by the hook's onSuccess callback
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  if (success) {
    return (
      <SuccessMessage
        message={`${capitalize(itemType)} updated successfully!`}
        subMessage="Refreshing..."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        {capitalize(itemType)} Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder={`Enter ${itemType} name`}
        disabled={loading}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-red-800 text-white py-2 rounded hover:bg-red-700 transition-colors"
          disabled={loading}
        >
          {loading ? `Updating...` : `Update ${capitalize(itemType)}`}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
      {(validationError || error) && (
        <div className="text-red-600 text-sm mt-2">
          {validationError || error}
        </div>
      )}
    </form>
  );
};

export default EditItemForm;
