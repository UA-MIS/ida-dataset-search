"use client";
import React, { useState } from "react";
import DatasetContainerWithActivity from "@/app/components/DatasetContainerWithActivity";
import LoadingMessage from "@/app/components/LoadingMessage";
import NoResultsMessage from "@/app/components/NoResultsMessage";
import Searchbar from "@/app/components/Searchbar";
import SidebarFilter from "@/app/components/SidebarFilter";
import Modal from "@/app/components/Modal";
import EditDatasetForm from "@/app/components/EditDatasetForm";
import ConfirmationMessage from "@/app/components/ConfirmationMessage";
import AddDataWizard from "@/app/components/AddDataWizard";
import { useSearchbar } from "@/app/hooks/useSearchbar";
import { useFetchDatasets } from "@/app/hooks/useFetchDatasets";
import { useDeleteDataset } from "@/app/hooks/useDeleteDataset";
import { useFetchTags } from "@/app/hooks/useFetchTags";
import { useFetchCategories } from "@/app/hooks/useFetchCategories";
import { useSidebarFilter } from "@/app/hooks/useSidebarFilter";
import { Dataset } from "@/app/types";
import { useModal } from "@/app/hooks/useModal";
import EditAccessInfoForm from "@/app/components/EditAccessInfoForm";

const Datasets = () => {
  const { datasets, isLoading: datasetsLoading, refetch } = useFetchDatasets();
  const { tags, isLoading: tagsLoading } = useFetchTags();
  const { categories, isLoading: categoriesLoading } = useFetchCategories();
  const [showFilters, setShowFilters] = useState(false);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  const [editingAccessInfo, setEditingAccessInfo] = useState<Dataset | null>(null);
  const [deletingDataset, setDeletingDataset] = useState<Dataset | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formKey, setFormKey] = useState(0); // Add formKey state
  // Create delete hook with refresh callback
  const { deleteDataset, isSuccess: deleteSuccess } = useDeleteDataset(refetch);

  const { handleFilterChange, filterDatasets, filterState } = useSidebarFilter(
    categories?.map((category) => category.name) || [],
    tags?.map((tag) => tag.name) || []
  );

  const { handleSearch, filteredItems: searchFilteredDatasets } = useSearchbar(
    datasets || [],
    "title"
  );

  // First apply sidebar filters, then apply search filter
  const sidebarFilteredDatasets = datasets ? filterDatasets(datasets) : [];
  const finalFilteredDatasets = sidebarFilteredDatasets.filter((dataset) =>
    searchFilteredDatasets.some(
      (searchDataset) => searchDataset.id === dataset.id
    )
  );

  const handleEditDataset = (dataset: Dataset) => {
    setEditingDataset(dataset);
    useModal("edit-dataset-modal");
  };

  const handleEditAccessInfo = (dataset: Dataset) => {
    setEditingAccessInfo(dataset);
    useModal("edit-access-info-modal");
  };

  const handleEditSuccess = () => {
    const modal = document.getElementById(
      "edit-dataset-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setEditingDataset(null);
    refetch(); // Refresh the datasets list
  };

  const handleEditCancel = () => {
    const modal = document.getElementById(
      "edit-dataset-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setEditingDataset(null);
  };

  const handleDeleteDataset = async (dataset: Dataset) => {
    setDeleteLoading(true);
    const success = await deleteDataset(dataset.id);
    if (success) {
      setDeletingDataset(null);
      const modal = document.getElementById(
        "delete-dataset-modal"
      ) as HTMLDialogElement;
      modal?.close();
      window.location.reload();
    }
    setDeleteLoading(false);
  };

  const confirmDeleteDataset = (dataset: Dataset) => {
    setDeletingDataset(dataset);
    useModal("delete-dataset-modal");
  };

  const cancelDeleteDataset = () => {
    setDeletingDataset(null);
    const modal = document.getElementById(
      "delete-dataset-modal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  const handleAddDatasetModalClose = () => {
    const modal = document.getElementById(
      "add-dataset-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setFormKey((k) => k + 1);
  };

  // Add useEffect to handle modal close event
  React.useEffect(() => {
    const modal = document.getElementById(
      "add-dataset-modal"
    ) as HTMLDialogElement;
    if (!modal) return;

    const handleClose = () => setFormKey((k) => k + 1);

    modal.addEventListener("close", handleClose);
    return () => {
      modal.removeEventListener("close", handleClose);
    };
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Datasets</h1>
          <button
            onClick={() => {
              useModal("add-dataset-modal");
            }}
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Dataset
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-xl font-semibold text-red-800">
            Search and Filter Datasets
          </h1>
          <br></br>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="w-full">
              <Searchbar
                onSearch={handleSearch}
                placeholder="Search datasets..."
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="font-medium">Filters</span>
              </button>
              <span className="text-sm text-gray-500">
                {finalFilteredDatasets.length} of {datasets?.length || 0}{" "}
                datasets
              </span>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <SidebarFilter
                      title="Categories"
                      options={
                        categories?.map((category) => category.name) || []
                      }
                      onFilterChange={(value) =>
                        handleFilterChange("categories", value)
                      }
                      selected={Array.from(filterState.categories)}
                    />
                  </div>
                  <div>
                    <SidebarFilter
                      title="Tags"
                      options={tags?.map((tag) => tag.name) || []}
                      onFilterChange={(value) =>
                        handleFilterChange("tags", value)
                      }
                      selected={Array.from(filterState.tags)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Datasets Grid */}
        {datasetsLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingMessage message="Loading datasets..." />
          </div>
        ) : finalFilteredDatasets.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 py-4">
            {finalFilteredDatasets.map((dataset) => (
              <DatasetContainerWithActivity
                key={dataset.id}
                dataset={dataset}
                onEditDataset={() => handleEditDataset(dataset)}
                onEditAccessInfo={() => handleEditAccessInfo(dataset)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <NoResultsMessage
              title="No Datasets Found"
              message="We couldn't find any datasets matching your search criteria. Try adjusting your search terms or filters."
            />
          </div>
        )}
      </div>
      {/* Add Dataset Modal */}
      <Modal
        id="add-dataset-modal"
        header="Add New Dataset"
        body={
          <AddDataWizard
            key={formKey}
            onSuccess={() => {
              refetch();
              handleAddDatasetModalClose();
            }}
          />
        }
        size="xl"
      />

      {/* Edit Dataset Modal */}
      <Modal
        id="edit-dataset-modal"
        header="Edit Dataset"
        body={
          editingDataset ? (
            <EditDatasetForm
              dataset={editingDataset}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          ) : (
            <div>Loading...</div>
          )
        }
        size="xl"
      />
      <Modal
        id="delete-dataset-modal"
        header="Delete Dataset"
        body={
          deletingDataset ? (
            <ConfirmationMessage
              title="Delete Dataset"
              message={`Are you sure you want to delete the dataset "${deletingDataset.title}"? This action cannot be undone.`}
              confirmText="Delete Dataset"
              cancelText="Cancel"
              variant="danger"
              onConfirm={() => handleDeleteDataset(deletingDataset)}
              onCancel={cancelDeleteDataset}
              loading={deleteLoading}
            />
          ) : (
            <div>Loading...</div>
          )
        }
        size="md"
      />
      <Modal
        id="edit-access-info-modal"
        header="Edit Access Info"
        body={
          <EditAccessInfoForm
            dataset_id={editingAccessInfo?.id || 0}
            modal_id="edit-access-info-modal"
          />
        }
        size="xl"
      />
    </>
  );
};

export default Datasets;
