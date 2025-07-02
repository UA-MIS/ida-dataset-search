"use client";
import DataTag from "@/app/components/DataTag";
import { categories } from "@/app/constants";
import { Tag } from "@/app/types";
import React from "react";
import Link from "next/link";
import { useFetchTags } from "@/app/hooks/useFetchTags";

const CategoriesTags = () => {
  const { tags, isLoading: tagsLoading } = useFetchTags();

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tags and Categories</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              Add Category
            </button>
            <button className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              Add New Tag
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.sort().map((category: string) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  {category}
                  <p># of datasets</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: Tag) => (
                <DataTag key={tag.id} tag={tag.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesTags;
