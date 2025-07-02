"use client";
import React from "react";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Red accent bar or logo */}
          <div className="bg-red-800 h-2 w-full" />
          <div className="px-8 py-10 flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Sign in to your account
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Please enter your credentials to access the admin panel
            </p>
            <div className="w-full mb-4">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: "bg-red-800 hover:bg-red-700 text-white",
                    card: "shadow-none border-none",
                    headerTitle: "text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButton:
                      "bg-gray-100 text-gray-700 hover:bg-red-50 border border-gray-200",
                    dividerRow: "my-4",
                  },
                }}
                redirectUrl="/admin"
              />
            </div>
            <div className="flex flex-col items-center w-full space-y-2 mt-2">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-red-800 transition-colors"
              >
                Return to Home
              </Link>
              <Link
                href="/forgot-password"
                className="text-sm text-red-700 hover:underline mt-1"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
