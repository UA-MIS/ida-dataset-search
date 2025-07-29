import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  alwaysShow?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  alwaysShow = true,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isSinglePage = totalPages <= 1;

  // Show up to 5 page numbers, centered on currentPage
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 2) {
      end = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 1) {
      start = Math.max(1, totalPages - 4);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (!alwaysShow && isSinglePage) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      <button
        className="px-2 py-1 border rounded disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isSinglePage}
      >
        Prev
      </button>
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`px-2 py-1 border rounded ${
            page === currentPage ? "bg-red-800 text-white" : ""
          } cursor-pointer`}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage || isSinglePage}
        >
          {page}
        </button>
      ))}
      <button
        className="px-2 py-1 border rounded disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isSinglePage}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
