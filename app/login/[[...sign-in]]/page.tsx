"use client";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-red-800 h-2 w-full" />
          <div className="px-8 py-10 flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Coming Soon
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Authentication is not yet configured.
            </p>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-red-800 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
