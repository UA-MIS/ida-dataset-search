import React from "react";
import Link from "next/link";

interface Props {
  sidebarId: string;
  color: string;
  textColor: string;
  homeRoute: string;
}

const Navbar = ({ sidebarId, color, textColor, homeRoute }: Props) => {
  return (
    <>
      <div
        className={`navbar ${color} ${textColor} shadow-sm transition-colors duration-200 px-4`}
      >
        <div className="flex-1 flex items-center gap-4">
          <label
            htmlFor={sidebarId}
            className="cursor-pointer p-2 hover:text-red-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
          <Link
            href={homeRoute}
            className="text-xl font-semibold hover:text-red-200 transition-colors"
          >
            University of Alabama Institute of Data Analytics
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
