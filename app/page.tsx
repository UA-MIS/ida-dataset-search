"use client";
import React, { useState } from "react";
import DatasetCard from "./components/DatasetCard";
import NoResultsMessage from "./components/NoResultsMessage";
import { useFetchTags } from "./hooks/useFetchTags";
import { useFetchCategories } from "./hooks/useFetchCategories";
import SidebarFilter from "./components/SidebarFilter";
import { useSidebarFilter } from "./hooks/useSidebarFilter";
import Searchbar from "./components/Searchbar";
import { useSearchbar } from "./hooks/useSearchbar";
import Modal from "./components/Modal";
import { useModal } from "./hooks/useModal";
import DownloadDatasetForm from "./components/DownloadDatasetForm";
import HomeSidebar from "./components/HomeSidebar";
import LoadingMessage from "./components/LoadingMessage";
import { useFetchActiveDatasets } from "./hooks/useFetchActiveDatasets";

const HomePage = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const { datasets, isLoading: datasetsLoading } = useFetchActiveDatasets();
  const { tags, isLoading: tagsLoading } = useFetchTags();
  const { categories, isLoading: categoriesLoading } = useFetchCategories();
  const isLoading =
    datasetsLoading ||
    tagsLoading ||
    categoriesLoading ||
    !datasets ||
    !tags ||
    !categories;

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

  const hasResults = finalFilteredDatasets.length > 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-xl font-bold text-red-800 text-center">
                University of Alabama Institute of Data Analytics
              </h1>
            </div>
            <HomeSidebar />
          </div>
        </div>

        <div className="pl-64">
          <div className="p-8">
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
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingMessage message="Loading datasets..." />
                </div>
              ) : !hasResults ? (
                <div className="flex justify-center items-center py-12">
                  <NoResultsMessage
                    title="No Datasets Found"
                    message="No datasets match the selected filters. Try adjusting your category or tag selections."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                  {finalFilteredDatasets.map((dataset) => (
                    <DatasetCard
                      key={dataset.id}
                      title={dataset.title}
                      tags={dataset.tags || []}
                      categories={dataset.categories || []}
                      description={dataset.description}
                      onDownload={() => {
                        setSelectedDatasetId(dataset.id);
                        useModal("download-dataset-modal");
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        header="Download Dataset"
        id="download-dataset-modal"
        body={<DownloadDatasetForm datasetId={selectedDatasetId} />}
      />
    </>
  );
};

export default HomePage;
