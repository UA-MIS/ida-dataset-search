"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <nav className="flex flex-col h-full px-4 space-y-4">
      {/* Home */}
      <Link
        href="/admin"
        className={`w-full px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-3 ${
          isActive("/admin")
            ? "bg-red-50 text-red-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Dashboard
      </Link>

      {/* Datasets */}
      <Link
        href="/admin/datasets"
        className={`w-full px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-3 ${
          isActive("/admin/datasets")
            ? "bg-red-50 text-red-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
        Datasets
      </Link>

      {/* Users */}
      <Link
        href="/admin/users"
        className={`w-full px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-3 ${
          isActive("/admin/users")
            ? "bg-red-50 text-red-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Users
      </Link>

      {/* Tags & Categories */}
      <Link
        href="/admin/categories&tags"
        className={`w-full px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-3 ${
          isActive("/admin/categories&tags")
            ? "bg-red-50 text-red-800"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        Tags & Categories
      </Link>
    </nav>
  );
}
