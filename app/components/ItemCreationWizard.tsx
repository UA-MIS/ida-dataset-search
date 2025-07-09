import React, { useState, useEffect } from "react";
import { useFetchDatasets } from "@/app/hooks/useFetchDatasets";
import { Tag } from "@/app/types";
import AssociateItemForm from "./AssociateItemForm";
import SuccessMessage from "./SuccessMessage";

const steps = ["Name", "Dataset Association", "Review & Submit"];

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

interface ItemCreationWizardProps {
  itemType: "tag" | "category";
  modalId: string; // New prop for modal ID
  onSuccess?: () => void;
}

const ItemCreationWizard: React.FC<ItemCreationWizardProps> = ({
  itemType,
  modalId,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [itemName, setItemName] = useState("");
  const [itemError, setItemError] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<Tag[]>([]);
  const { datasets, isLoading: datasetsLoading } = useFetchDatasets();
  const [selectedDatasets, setSelectedDatasets] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset function to clear all form state
  const resetForm = () => {
    setStep(0);
    setItemName("");
    setItemError(null);
    setSelectedDatasets([]);
    setSubmitError(null);
    setSuccess(false);
    setLoading(false);
  };

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  // Reset form when itemType changes
  useEffect(() => {
    resetForm();
  }, [itemType]);

  // Plural mapping for API endpoints
  const apiPlural = {
    tag: "tags",
    category: "categories",
  };

  // Fetch all items for validation
  useEffect(() => {
    fetch(`/api/${apiPlural[itemType]}`)
      .then((res) => res.json())
      .then((data) => setAllItems(data))
      .catch(() => setAllItems([]));
  }, [itemType]);

  // Stepper UI
  const Stepper = () => (
    <div className="flex items-center justify-center mb-6">
      {steps.map((label, idx) => (
        <React.Fragment key={label}>
          <div
            className={`flex flex-col items-center ${
              idx === step ? "text-red-800" : "text-gray-400"
            }`}
          >
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${
                idx === step
                  ? "border-red-800 bg-red-800 text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {idx + 1}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-8 h-0.5 bg-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Step 1: Name
  const validateItemName = () => {
    if (!itemName.trim()) {
      setItemError(`${capitalize(itemType)} name is required.`);
      return false;
    }
    const lowerName = itemName.trim().toLowerCase();
    const duplicate = allItems.find(
      (item) => item.name.toLowerCase() === lowerName
    );
    if (duplicate) {
      setItemError(`A ${itemType} with this name already exists.`);
      return false;
    }
    const fuzzyMatch = allItems.find(
      (item) => levenshtein(item.name.toLowerCase(), lowerName) <= 2
    );
    if (fuzzyMatch) {
      setItemError(
        `Did you mean '${fuzzyMatch.name}'? Please check for typos or duplicates.`
      );
      return false;
    }
    setItemError(null);
    return true;
  };

  // Step 2: Dataset Association
  const datasetOptions = (datasets || []).map((d) => ({
    value: d.id,
    label: d.title,
  }));
  const allSelected =
    selectedDatasets.length === datasetOptions.length &&
    datasetOptions.length > 0;

  const handleSelectAll = () => setSelectedDatasets(datasetOptions);
  const handleClearAll = () => setSelectedDatasets([]);

  // Step 3: Review & Submit
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    try {
      // 1. Create the item
      const itemRes = await fetch(`/api/${apiPlural[itemType]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName.trim() }),
      });
      const itemData = await itemRes.json();
      if (!itemRes.ok || !itemData.id) {
        setSubmitError(itemData.error || `Failed to create ${itemType}.`);
        setLoading(false);
        return;
      }
      // 2. Create dataset relation
      if (selectedDatasets.length > 0) {
        for (const ds of selectedDatasets) {
          const relRes = await fetch(`/api/dataset_${apiPlural[itemType]}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              dataset_id: ds.value,
              [`${itemType}_id`]: itemData.id,
            }),
          });
          const relData = await relRes.json();
          if (!relRes.ok) {
            setSubmitError(
              relData.error || `Failed to associate ${itemType} with dataset.`
            );
            setLoading(false);
            return;
          }
        }
      }
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        window.location.reload();
      }, 1800);
    } catch (err) {
      setSubmitError(`Failed to create ${itemType} or associate datasets.`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel function to close modal without saving
  const handleCancel = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    modal?.close();
    resetForm();
  };

  // Step content
  let content;
  if (success) {
    content = (
      <SuccessMessage
        message={`${capitalize(itemType)} created and associated successfully!`}
        subMessage="Refreshing..."
      />
    );
  } else if (step === 0) {
    content = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateItemName()) setStep(1);
        }}
        className="space-y-4"
      >
        <label className="block text-sm font-medium">
          {capitalize(itemType)} Name
        </label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder={`Enter ${itemType} name`}
          disabled={loading}
        />
        {itemError && (
          <div className="text-red-600 text-sm mt-2">{itemError}</div>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            Next
          </button>
        </div>
      </form>
    );
  } else if (step === 1) {
    content = (
      <>
        <AssociateItemForm
          allDatasets={datasetOptions}
          selectedDatasets={selectedDatasets}
          onChange={setSelectedDatasets}
          loading={datasetsLoading}
          mode="create"
        />
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            onClick={() => setStep(0)}
            disabled={loading}
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              className="bg-gray-100 text-gray-700 py-2 px-6 rounded hover:bg-gray-200 transition-colors"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
              onClick={() => setStep(2)}
              disabled={loading}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  } else if (step === 2) {
    content = (
      <div className="space-y-4">
        <div>
          <div className="font-semibold mb-2">
            Review {capitalize(itemType)}
          </div>
          <div className="mb-2">
            <span className="font-medium">{capitalize(itemType)} Name:</span>{" "}
            {itemName}
          </div>
          <div className="mb-2">
            <span className="font-medium">Associated Datasets:</span>
            {selectedDatasets.length === 0 ? (
              <span className="ml-2 text-gray-500">None</span>
            ) : (
              <ul className="list-disc ml-6">
                {selectedDatasets.map((ds) => (
                  <li key={ds.value}>{ds.label}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {submitError && (
          <div className="text-red-600 text-sm mt-2">{submitError}</div>
        )}
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            onClick={() => setStep(1)}
            disabled={loading}
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              className="bg-gray-100 text-gray-700 py-2 px-6 rounded hover:bg-gray-200 transition-colors"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? `Creating...` : `Create ${capitalize(itemType)}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Stepper />
      {content}
    </div>
  );
};

function capitalize(str: string | undefined | null) {
  if (typeof str !== "string" || !str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default ItemCreationWizard;
