import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaSearch } from "react-icons/fa";

const HomeSidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="flex flex-col h-full px-4 space-y-4">
      {/* Home */}
      <Link
        href="/"
        className={`w-full px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-3 ${
          isActive("/")
            ? "bg-red-50 text-red-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <FaSearch className="h-4 w-4" />
        Search & Browse
      </Link>
    </nav>
  );
};

export default HomeSidebar;
