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
import LoadingMessage from "./components/LoadingMessage";
import { useFetchActiveDatasets } from "./hooks/useFetchActiveDatasets";
import { FaDatabase, FaFilter, FaCog } from "react-icons/fa";
import Link from "next/link";

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
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
                <FaDatabase className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  IDA Dataset Search
                </h1>
                <p className="text-xs text-gray-500">
                  University of Alabama Institute of Data Analytics
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaCog className="h-4 w-4" />
              Admin
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Section */}
          <div className="mb-6">
            <Searchbar
              onSearch={handleSearch}
              placeholder="Search datasets..."
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaFilter className="h-3.5 w-3.5" />
              Filters
            </button>
            <span className="text-sm text-gray-500">
              {finalFilteredDatasets.length} of {datasets?.length || 0} datasets
            </span>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
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

          {/* Dataset Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <LoadingMessage message="Loading datasets..." />
            </div>
          ) : !hasResults ? (
            <div className="flex justify-center items-center py-16">
              <NoResultsMessage
                title="No Datasets Found"
                message="No datasets match the selected filters. Try adjusting your category or tag selections."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {finalFilteredDatasets.map((dataset) => (
                <DatasetCard
                  key={dataset.id}
                  title={dataset.title}
                  tags={dataset.tags || []}
                  categories={dataset.categories || []}
                  description={dataset.description}
                  type={dataset.type}
                  downloads={dataset.downloads}
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
      <Modal
        header="Download Dataset"
        id="download-dataset-modal"
        body={<DownloadDatasetForm datasetId={selectedDatasetId} />}
      />
    </>
  );
};

export default HomePage;
