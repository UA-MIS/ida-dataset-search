"use client";
import React, { useState, useEffect } from "react";
import DatasetCard from "@/app/components/DatasetCard";
import DatasetCardSkeleton from "@/app/components/DatasetCardSkeleton";
import NoResultsMessage from "@/app/components/NoResultsMessage";
import Searchbar from "@/app/components/Searchbar";
import SidebarFilter from "@/app/components/SidebarFilter";
import Modal from "@/app/components/Modal";
import EditDatasetForm from "@/app/components/EditDatasetForm";
import AddDataForm from "@/app/components/AddDataForm";
import { useSearchbar } from "@/app/hooks/useSearchbar";
import { useFetchDatasets } from "@/app/hooks/useFetchDatasets";
import { useDeleteDataset } from "@/app/hooks/useDeleteDataset";
import { useFetchTags } from "@/app/hooks/useFetchTags";
import { useSidebarFilter } from "@/app/hooks/useSidebarFilter";
import { categories } from "@/app/constants";
import Toast from "@/app/components/Toast";
import { Dataset } from "@/app/types";

const Datasets = () => {
  const { datasets, isLoading: datasetsLoading, refetch } = useFetchDatasets();
  const { tags, isLoading: tagsLoading } = useFetchTags();
  const [showFilters, setShowFilters] = useState(false);
  const [editingDataset, setEditingDataset] = useState<Dataset | null>(null);
  // Create delete hook with refresh callback
  const { deleteDataset, isSuccess: deleteSuccess } = useDeleteDataset(refetch);

  const { handleFilterChange, filterDatasets } = useSidebarFilter(
    categories,
    tags?.map((tag) => tag.name) || []
  );

  const { handleSearch, filteredDatasets: searchFilteredDatasets } =
    useSearchbar(datasets || []);

  // First apply sidebar filters, then apply search filter
  const sidebarFilteredDatasets = datasets ? filterDatasets(datasets) : [];
  const finalFilteredDatasets = sidebarFilteredDatasets.filter((dataset) =>
    searchFilteredDatasets.some(
      (searchDataset) => searchDataset.id === dataset.id
    )
  );

  // Handle modal opening when editingDataset changes
  useEffect(() => {
    if (editingDataset) {
      const modal = document.getElementById(
        "edit-dataset-modal"
      ) as HTMLDialogElement;
      if (modal) {
        // Small delay to ensure the modal is properly rendered
        setTimeout(() => {
          modal.showModal();
        }, 50);
      }
    }
  }, [editingDataset]);

  const handleEdit = (dataset: Dataset) => {
    setEditingDataset(dataset);
  };

  const handleEditSuccess = () => {
    setEditingDataset(null);
    const modal = document.getElementById(
      "edit-dataset-modal"
    ) as HTMLDialogElement;
    if (modal) modal.close();
    refetch(); // Refresh the datasets list
  };

  const handleEditCancel = () => {
    setEditingDataset(null);
    const modal = document.getElementById(
      "edit-dataset-modal"
    ) as HTMLDialogElement;
    if (modal) modal.close();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Datasets</h1>
          <button
            onClick={() => {
              const modal = document.getElementById(
                "add-dataset-modal"
              ) as HTMLDialogElement;
              modal?.showModal();
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
          <h1 className="text-xl font-semibold text-red-800">Search and Filter Datasets</h1>
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
                      options={categories.sort()}
                      onFilterChange={(value) =>
                        handleFilterChange("categories", value)
                      }
                    />
                  </div>
                  <div>
                    <SidebarFilter
                      title="Tags"
                      options={tags?.map((tag) => tag.name) || []}
                      onFilterChange={(value) =>
                        handleFilterChange("tags", value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Datasets Grid */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {datasetsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <DatasetCardSkeleton key={index} />
              ))}
            </div>
          ) : finalFilteredDatasets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredDatasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  title={dataset.title}
                  category={dataset.category}
                  tags={dataset.tags || []}
                  onDelete={() => deleteDataset(dataset.id)}
                  onEdit={() => handleEdit(dataset)}
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
      </div>

      {/* Add Dataset Modal */}
      <Modal
        id="add-dataset-modal"
        header="Add New Dataset"
        body={<AddDataForm onSuccess={refetch} />}
      />

      {/* Edit Dataset Modal */}
      {editingDataset && (
        <Modal
          id="edit-dataset-modal"
          header="Edit Dataset"
          body={
            <EditDatasetForm
              dataset={editingDataset}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          }
        />
      )}

      {deleteSuccess && (
        <Toast
          message="Dataset deleted successfully!"
          color="success"
          duration={3000}
          onClose={() => {}}
        />
      )}
    </>
  );
};

export default Datasets;
