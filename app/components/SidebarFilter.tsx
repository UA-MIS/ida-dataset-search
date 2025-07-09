import React, { useRef } from "react";
import Searchbar from "./Searchbar";
import { useSidebarSearch } from "../hooks/useSidebarSearch";
import NoResultsMessage from "./NoResultsMessage";

interface Props {
  title: string;
  options: string[];
  onFilterChange: (selectedOption: string) => void;
  selected: string[];
}

const SidebarFilter = ({ title, options, onFilterChange, selected }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleSearch, filteredOptions } = useSidebarSearch(options);

  const handleSelectAll = () => {
    const checkboxes = formRef.current?.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.checked = true;
        onFilterChange(checkbox.value);
      }
    });
  };

  const handleClearAll = () => {
    const checkboxes = formRef.current?.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.checked = false;
        onFilterChange(checkbox.value);
      }
    });
  };

  return (
    <>
      <form ref={formRef}>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-semibold">
            {title}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="btn btn-sm btn-outline btn-info"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="btn btn-sm btn-outline btn-error"
            >
              Clear All
            </button>
          </div>
          <Searchbar
            onSearch={handleSearch}
            placeholder={`Search ${title.toLowerCase()}...`}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <NoResultsMessage
                title={`No ${title} Found`}
                message={`No ${title.toLowerCase()} match your search. Try adjusting your search terms.`}
              />
            ) : (
              filteredOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={option}
                    value={option}
                    defaultChecked={selected.includes(option)}
                    onChange={(e) => onFilterChange(e.target.value)}
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default SidebarFilter;
