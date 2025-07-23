"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaDatabase, FaUsers, FaTags } from "react-icons/fa";

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
        <FaHome className="h-4 w-4" />
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
        <FaDatabase className="h-4 w-4" />
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
        <FaUsers className="h-4 w-4" />
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
        <FaTags className="h-4 w-4" />
        Tags & Categories
      </Link>
    </nav>
  );
}
