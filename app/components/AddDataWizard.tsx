import React, { useState, useEffect } from "react";
import AddDataForm from "./AddDataForm";
import AddAccessInfoForm from "./AddAccessInfoForm";
import { Dataset, AccessInfo, Tag, Category } from "../types";

const steps = ["Dataset Info", "Access Info", "Review & Submit"];

function capitalize(str: string | undefined | null) {
  if (typeof str !== "string" || !str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const emptyDataset: Omit<Dataset, "id"> = {
  title: "",
  description: "",
  category: "",
  tags: [],
  categories: [],
  type: "",
  isActive: "T",
};

const AddDataWizard: React.FC<{
  onSuccess: () => void;
  modalId?: string;
}> = ({ onSuccess, modalId }) => {
  const [step, setStep] = useState(0);
  const [datasetInfo, setDatasetInfo] =
    useState<Omit<Dataset, "id">>(emptyDataset);
  const [accessInfoList, setAccessInfoList] = useState<
    Omit<AccessInfo, "id" | "dataset_id">[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [existingCategories, setExistingCategories] = useState<Category[]>([]);

  // Fetch existing tags and categories
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const tags = await response.json();
          setExistingTags(tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const cats = await response.json();
          setExistingCategories(cats);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchTags();
    fetchCategories();
  }, []);

  // Cancel logic for modal
  const handleCancel = () => {
    if (modalId) {
      const modal = document.getElementById(modalId) as HTMLDialogElement;
      modal?.close();
    }
    setStep(0);
    setDatasetInfo(emptyDataset);
    setAccessInfoList([]);
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

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

  // Submission handler for dataset and access info
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // 1. Create dataset
      const datasetRes = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: datasetInfo.title,
          description: datasetInfo.description,
          type: datasetInfo.type,
        }),
      });
      if (!datasetRes.ok) throw new Error("Failed to create dataset");
      const dataset = await datasetRes.json();
      const dataset_id = dataset.id || dataset.dataset_id;

      // 2. Handle tags: create new ones or use existing ones
      const tagIds = await Promise.all(
        datasetInfo.tags.map(async (tagName) => {
          const existingTag = existingTags.find(
            (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
          );
          if (existingTag) {
            return existingTag.id;
          } else {
            const tagResponse = await fetch("/api/tags", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: tagName }),
            });
            if (!tagResponse.ok) {
              throw new Error(`Failed to create tag: ${tagName}`);
            }
            const newTag = await tagResponse.json();
            return newTag.id;
          }
        })
      );

      // 3. Create dataset-tag relationships
      await Promise.all(
        tagIds.map(async (tagId: number) => {
          const relationshipResponse = await fetch("/api/dataset_tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_id, tag_id: tagId }),
          });
          if (!relationshipResponse.ok) {
            throw new Error(
              `Failed to create relationship for tag ID: ${tagId}`
            );
          }
        })
      );

      // 4. Handle categories: create new ones or use existing ones
      const categoryIds = await Promise.all(
        datasetInfo.categories.map(async (categoryName) => {
          const existingCategory = existingCategories.find(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
          );
          if (existingCategory) {
            return existingCategory.id;
          } else {
            const categoryResponse = await fetch("/api/categories", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: categoryName }),
            });
            if (!categoryResponse.ok) {
              throw new Error(`Failed to create category: ${categoryName}`);
            }
            const newCategory = await categoryResponse.json();
            return newCategory.id;
          }
        })
      );

      // 5. Create dataset-category relationships
      await Promise.all(
        categoryIds.map(async (categoryId: number) => {
          const relationshipResponse = await fetch("/api/dataset_categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataset_id, category_id: categoryId }),
          });
          if (!relationshipResponse.ok) {
            throw new Error(
              `Failed to create relationship for category ID: ${categoryId}`
            );
          }
        })
      );

      // 6. Create access info entries
      for (const info of accessInfoList) {
        const res = await fetch("/api/access_info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataset_id,
            field: info.field,
            value: info.value,
          }),
        });
        if (!res.ok) throw new Error("Failed to add access info");
      }
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleCancel();
      }, 1800);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Step content
  let content;
  if (success) {
    content = (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-green-600 text-lg font-semibold mb-2">
          Dataset and access info added!
        </div>
        <div className="text-gray-500">Refreshing...</div>
      </div>
    );
  } else if (step === 0) {
    content = (
      <>
        <AddDataForm
          value={datasetInfo}
          onChange={(field, value) =>
            setDatasetInfo((prev) => ({ ...prev, [field]: value }))
          }
          disabled={loading}
          existingTags={existingTags}
          existingCategories={existingCategories.map((c) => c.name)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
            onClick={() => setStep(1)}
            disabled={
              loading ||
              !datasetInfo.title ||
              !datasetInfo.description ||
              datasetInfo.tags.length === 0 ||
              datasetInfo.categories.length === 0
            }
          >
            Next
          </button>
        </div>
      </>
    );
  } else if (step === 1) {
    content = (
      <>
        <AddAccessInfoForm
          accessInfoList={accessInfoList}
          setAccessInfoList={setAccessInfoList}
        />
        {/* Styled, prominent div for access info list */}
        <div className="mt-8 mb-6">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto min-h-[220px] border-2 border-red-100">
            <h4 className="text-lg font-semibold mb-4 text-red-800 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Access Info Pairs
            </h4>
            {accessInfoList.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No access info fields added yet.
              </div>
            ) : (
              <div className="space-y-3">
                {accessInfoList.map((info, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-red-50 rounded px-4 py-3 border border-red-100 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                      <span className="font-mono text-base text-gray-700 w-40 truncate">
                        <span className="font-semibold text-red-700">
                          Field:
                        </span>{" "}
                        {info.field}
                      </span>
                      <span className="font-mono text-base text-gray-700 w-60 truncate">
                        <span className="font-semibold text-red-700">
                          Value:
                        </span>{" "}
                        {info.value}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="ml-4 px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-colors font-semibold shadow"
                      onClick={() =>
                        setAccessInfoList(
                          accessInfoList.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
              onClick={() => setStep(0)}
              disabled={loading}
            >
              Back
            </button>
            <button
              className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
              onClick={() => setStep(2)}
              disabled={loading || accessInfoList.length === 0}
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
          <div className="font-semibold mb-2">Review Dataset</div>
          <div className="mb-2">
            <span className="font-medium">Title:</span> {datasetInfo.title}
          </div>
          <div className="mb-2">
            <span className="font-medium">Description:</span>{" "}
            {datasetInfo.description}
          </div>
          <div className="mb-2">
            <span className="font-medium">Categories:</span>{" "}
            {datasetInfo.categories.join(", ")}
          </div>
          <div className="mb-2">
            <span className="font-medium">Tags:</span>{" "}
            {datasetInfo.tags.join(", ")}
          </div>
          <div className="mb-2">
            <span className="font-medium">Access Info:</span>
            {accessInfoList.length === 0 ? (
              <span className="ml-2 text-gray-500">None</span>
            ) : (
              <ul className="list-disc ml-6">
                {accessInfoList.map((info, idx) => (
                  <li key={idx} className="font-mono">
                    {info.field}: {info.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </button>
            <button
              className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Dataset"}
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

export default AddDataWizard;
