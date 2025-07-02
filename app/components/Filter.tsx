import React, { useState, useEffect, useRef } from "react";

interface Props {
  options: string[];
  title: string;
  onFilterChange: (selectedOption: string) => void;
}

const Filter = ({ options, title, onFilterChange }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      typeof option === "string" &&
      option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="relative flex-shrink-0 max-w-md w-full" ref={dropdownRef}>
      <h3 className="text-lg text-center font-bold text-red-800 mb-2">
        {title}
      </h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Search options..."
          className="input input-bordered w-full max-w-md"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              onFilterChange("");
            }
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isOpen && (
          <div className="absolute z-10 w-full max-w-md mt-1 bg-white rounded-md shadow-lg">
            <ul className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onFilterChange(option);
                      setSearchQuery(option);
                      setIsOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No options found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
