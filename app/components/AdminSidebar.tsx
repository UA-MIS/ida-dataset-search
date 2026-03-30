"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaDatabase,
  FaUsers,
  FaTags,
  FaArrowLeft,
} from "react-icons/fa";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `w-full px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-3 ${
      isActive(path)
        ? "bg-red-50 text-red-800"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="flex flex-col h-full px-4 space-y-1">
      <Link href="/admin" className={linkClass("/admin")}>
        <FaHome className="h-4 w-4" />
        Dashboard
      </Link>

      <Link href="/admin/datasets" className={linkClass("/admin/datasets")}>
        <FaDatabase className="h-4 w-4" />
        Datasets
      </Link>

      <Link href="/admin/users" className={linkClass("/admin/users")}>
        <FaUsers className="h-4 w-4" />
        Users
      </Link>

      <Link
        href="/admin/categories&tags"
        className={linkClass("/admin/categories&tags")}
      >
        <FaTags className="h-4 w-4" />
        Tags & Categories
      </Link>

      <div className="flex-1" />

      <div className="pb-6">
        <Link
          href="/"
          className="w-full px-4 py-2 rounded-md transition-colors flex items-center gap-3 text-gray-500 hover:text-red-700 hover:bg-red-50 font-medium"
        >
          <FaArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </nav>
  );
}
