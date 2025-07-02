import React from "react";
import Searchbar from "./Searchbar";

interface Props {
  title?: string;
  onSearch: (query: string) => void;
}

const DataSearch = ({ title, onSearch }: Props) => {
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-center py-2">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center w-full">
        <div className="flex-1 min-w-[200px] max-w-[300px]">
          <Searchbar onSearch={onSearch} />
        </div>
      </div>
    </>
  );
};

export default DataSearch;
