import React from "react";

interface TableProps {
  headers: string[];
  rows: any[];
}

export default function Table({ headers, rows }: TableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="text-center">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-100 transition-colors duration-150 ease-in-out">
            {headers.map((header) => (
              <td key={`${rowIndex}-${header}`} className="text-center">{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
