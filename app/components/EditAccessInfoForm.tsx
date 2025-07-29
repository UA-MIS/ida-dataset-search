import React, { useState } from "react";
import LoadingMessage from "./LoadingMessage";
import { useFetchAccessInfo } from "../hooks/useFetchAccessInfo";
import { useUpdateAccessInfo } from "../hooks/useUpdateAccessInfo";

interface Props {
  dataset_id: number;
  modal_id: string;
}

const EditAccessInfoForm = ({ dataset_id, modal_id }: Props) => {
  const { accessInfo, isLoading } = useFetchAccessInfo(dataset_id);
  const { updateAccessInfo } = useUpdateAccessInfo();
  const [editValues, setEditValues] = useState<
    Record<string, { field: string; value: string }>
  >({});
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [batchSuccess, setBatchSuccess] = useState(false);

  // Initialize editValues with current accessInfo if not already set
  React.useEffect(() => {
    if (accessInfo.length > 0 && Object.keys(editValues).length === 0) {
      const initial: Record<string, { field: string; value: string }> = {};
      accessInfo.forEach((info) => {
        initial[String(info.id)] = { field: info.field, value: info.value };
      });
      setEditValues(initial);
    }
    // eslint-disable-next-line
  }, [accessInfo]);

  if (isLoading) return <LoadingMessage message="Loading access info..." />;

  const handleChange = (
    id: string | number,
    key: "field" | "value",
    value: string
  ) => {
    setEditValues((prev) => ({
      ...prev,
      [String(id)]: { ...prev[String(id)], [key]: value },
    }));
  };

  const handleSaveAll = async () => {
    setBatchLoading(true);
    setBatchError(null);
    setBatchSuccess(false);
    try {
      const updates = accessInfo.map((info) => {
        const idStr = String(info.id);
        const original = { field: info.field, value: info.value };
        const edited = editValues[idStr] || original;
        if (
          edited.field !== original.field ||
          edited.value !== original.value
        ) {
          return updateAccessInfo(
            dataset_id,
            idStr,
            edited.field,
            edited.value
          );
        }
        return Promise.resolve(true);
      });
      const results = await Promise.all(updates);
      if (results.some((r) => r === false)) {
        setBatchError("One or more updates failed.");
      } else {
        setBatchSuccess(true);
        // Optionally, trigger a reload in parent if needed
      }
    } catch (err) {
      setBatchError("Failed to update access info.");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 text-gray-700 text-sm">
        <strong>Instructions:</strong> Click on a field or value to edit. Edit
        both the key (field) and value as needed, then click <b>Save All</b> to
        apply changes.
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">Field</th>
              <th className="px-4 py-2 text-left border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            {accessInfo.map((info) => (
              <tr key={info.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={editValues[String(info.id)]?.field ?? info.field}
                    onChange={(e) =>
                      handleChange(info.id, "field", e.target.value)
                    }
                    disabled={batchLoading}
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={editValues[String(info.id)]?.value ?? info.value}
                    onChange={(e) =>
                      handleChange(info.id, "value", e.target.value)
                    }
                    disabled={batchLoading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          className="btn btn-primary"
          onClick={handleSaveAll}
          disabled={batchLoading}
        >
          {batchLoading ? "Saving..." : "Save All"}
        </button>
        {batchSuccess && (
          <span className="text-green-600 font-medium">All changes saved!</span>
        )}
        {batchError && (
          <span className="text-red-600 font-medium">{batchError}</span>
        )}
        <button
          className="btn btn-error ml-auto"
          onClick={() => {
            const modal = document.getElementById(
              modal_id
            ) as HTMLDialogElement;
            modal?.close();
          }}
          disabled={batchLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditAccessInfoForm;
