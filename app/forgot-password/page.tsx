"use client";
import React, { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
        setSuccess("A reset code has been sent to your email.");
      })
      .catch((err) => {
        setError(err.errors?.[0]?.longMessage || "Something went wrong.");
      });
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
          setSuccess("Password reset! Redirecting...");
          setTimeout(() => router.push("/admin"), 1500);
        } else {
          setError("Unexpected status: " + result.status);
        }
      })
      .catch((err) => {
        setError(err.errors?.[0]?.longMessage || "Something went wrong.");
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-red-800 h-2 w-full" />
          <div className="px-8 py-10 flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Forgot your password?
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
              Enter your email to receive a password reset code.
            </p>
            <form
              onSubmit={!successfulCreation ? create : reset}
              className="w-full flex flex-col gap-4"
            >
              {!successfulCreation && (
                <>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. john@doe.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Send password reset code
                  </button>
                  {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  )}
                  {success && (
                    <p className="text-green-700 text-sm text-center">
                      {success}
                    </p>
                  )}
                </>
              )}
              {successfulCreation && (
                <>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="password"
                  >
                    New password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="code"
                  >
                    Password reset code (check your email)
                  </label>
                  <input
                    id="code"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Reset password
                  </button>
                  {error && (
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  )}
                  {success && (
                    <p className="text-green-700 text-sm text-center">
                      {success}
                    </p>
                  )}
                  {secondFactor && (
                    <p className="text-yellow-700 text-sm text-center">
                      2FA is required, but this UI does not handle that.
                    </p>
                  )}
                </>
              )}
            </form>
            <div className="flex flex-col items-center w-full space-y-2 mt-6">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-red-800 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
