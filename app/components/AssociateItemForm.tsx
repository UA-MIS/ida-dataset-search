import React, { useEffect, useState } from "react";
import Select from "react-select";

interface DatasetOption {
  value: string | number;
  label: string;
}

interface AssociateItemFormProps {
  allDatasets: DatasetOption[];
  selectedDatasets: DatasetOption[];
  onChange: (selected: DatasetOption[]) => void;
  onSubmit?: (selected: DatasetOption[]) => void;
  loading?: boolean;
  mode?: "create" | "edit";
  modalId?: string; // New prop for modal ID
}

const dedupeOptions = (options: DatasetOption[]): DatasetOption[] => {
  const seen = new Set();
  return options.filter((opt) => {
    if (seen.has(opt.value)) return false;
    seen.add(opt.value);
    return true;
  });
};

const AssociateItemForm: React.FC<AssociateItemFormProps> = ({
  allDatasets,
  selectedDatasets,
  onChange,
  onSubmit,
  loading = false,
  mode = "create",
  modalId,
}) => {
  const uniqueAllDatasets = dedupeOptions(allDatasets);
  const uniqueSelectedDatasets = dedupeOptions(selectedDatasets);

  const allSelected =
    selectedDatasets.length === allDatasets.length && allDatasets.length > 0;

  const handleSelectAll = () => onChange(allDatasets);
  const handleClearAll = () => onChange([]);

  // Cancel function to close modal
  const handleCancel = () => {
    if (modalId) {
      const modal = document.getElementById(modalId) as HTMLDialogElement;
      modal?.close();
    }
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("AssociateItemForm onSubmit called", selectedDatasets);
        if (onSubmit) onSubmit(selectedDatasets);
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">
          Associate Datasets (optional)
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-red-800 underline"
            onClick={handleSelectAll}
            disabled={allSelected || loading}
          >
            Select All
          </button>
          <button
            type="button"
            className="text-xs text-gray-500 underline"
            onClick={handleClearAll}
            disabled={selectedDatasets.length === 0 || loading}
          >
            Clear All
          </button>
        </div>
      </div>
      {isClient && (
        <Select
          isMulti
          isLoading={loading}
          options={uniqueAllDatasets}
          value={uniqueSelectedDatasets}
          onChange={(value) => onChange([...value])}
          placeholder="Search and select datasets..."
          classNamePrefix="react-select"
          isDisabled={loading}
        />
      )}
      <div className="flex justify-end mt-4 gap-2">
        {mode === "edit" && modalId && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        {mode === "edit" && (
          <button
            type="submit"
            className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Associations"}
          </button>
        )}
      </div>
    </form>
  );
};

export default AssociateItemForm;
