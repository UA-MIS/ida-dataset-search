import React, { useState } from "react";

interface TableProps {
  headers: string[];
  rows: any[];
}

export default function Table({ headers, rows }: TableProps) {
  const [sortKey, setSortKey] = useState<string>(headers[0]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (header: string) => {
    if (sortKey === header) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(header);
      setSortDirection("asc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="text-center cursor-pointer select-none hover:underline"
              onClick={() => handleSort(header)}
            >
              {header}
              {sortKey === header && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, rowIndex) => (
          <tr
            key={row.id ?? rowIndex}
            className="hover:bg-gray-100 transition-colors duration-150 ease-in-out"
          >
            {headers.map((header) => (
              <td
                key={`${row.id ?? rowIndex}-${header}`}
                className="text-center"
              >
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
