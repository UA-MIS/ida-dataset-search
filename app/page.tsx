"use client";
import React, { useEffect } from "react";
import DatasetContainer from "./components/DatasetContainer";
import DatasetSkeleton from "./components/DatasetSkeleton";
import NoResultsMessage from "./components/NoResultsMessage";
import { categories } from "./constants";
import { useFetchDatasets } from "./hooks/useFetchDatasets";
import { useFetchTags } from "./hooks/useFetchTags";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SidebarFilter from "./components/SidebarFilter";
import { useSidebarFilter } from "./hooks/useSidebarFilter";
import Searchbar from "./components/Searchbar";
import { useSearchbar } from "./hooks/useSearchbar";

const HomePage = () => {
  const { datasets, isLoading: datasetsLoading } = useFetchDatasets();
  const { tags, isLoading: tagsLoading } = useFetchTags();
  const isLoading = datasetsLoading || tagsLoading || !datasets || !tags;

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

  const hasResults = finalFilteredDatasets.length > 0;

  return (
    <>
      <Sidebar
        title="IDA Home"
        id="home-sidebar"
        pageChildren={
          <>
            <Navbar
              color="bg-red-800"
              textColor="text-white"
              sidebarId="home-sidebar"
              homeRoute="/"
            />
            <div className="flex flex-col gap-4 p-4">
              <Searchbar onSearch={handleSearch} />
              {isLoading ? (
                <>
                  <DatasetSkeleton />
                  <DatasetSkeleton />
                </>
              ) : !hasResults ? (
                <NoResultsMessage
                  title="No Datasets Found"
                  message="No datasets match the selected filters. Try adjusting your category or tag selections."
                />
              ) : (
                finalFilteredDatasets.map((dataset) => (
                  <DatasetContainer
                    key={dataset.id}
                    id={dataset.id}
                    title={dataset.title}
                    tags={dataset.tags || []}
                    category={dataset.category || ""}
                  />
                ))
              )}
            </div>
          </>
        }
        sidebarChildren={
          <>
            <div className="flex flex-col pt-2">
              <SidebarFilter
                title="Categories"
                options={categories.sort()}
                onFilterChange={(value) =>
                  handleFilterChange("categories", value)
                }
              />
              <div className="divider"></div>
              <SidebarFilter
                title="Tags"
                options={tags?.map((tag) => tag.name) || []}
                onFilterChange={(value) => handleFilterChange("tags", value)}
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default HomePage;
