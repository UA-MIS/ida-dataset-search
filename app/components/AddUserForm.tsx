"use client";
import React, { useState } from 'react'

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
      });
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");
    
        try {
          const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || "Failed to create user");
          }
    
          setSuccess(
            `User created successfully! Temporary password: ${data.temporaryPassword}. Share this with the user. They can log in and use 'Forgot password?' to set a new password.`
          );
          setFormData({
            email: "",
            firstName: "",
            lastName: "",
          });
    
          // Close modal after a short delay
          setTimeout(() => {
            const modal = document.getElementById(
              "add-user-modal"
            ) as HTMLDialogElement;
            modal?.close();
          }, 3000); // Increased delay to show the success message
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setIsLoading(false);
        }
      };
    
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                const modal = document.getElementById(
                  "add-user-modal"
                ) as HTMLDialogElement;
                modal?.close();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      );
}

export default AddUserForm