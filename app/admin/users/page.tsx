"use client";
import React, { useState } from "react";
import Modal from "@/app/components/Modal";
import Table from "@/app/components/Table";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import { useDeleteUser } from "@/app/hooks/useDeleteUser";
import Toast from "@/app/components/Toast";
import { useUpdateUser } from "@/app/hooks/useUpdateUser";

const Users = () => {
  const { users, isLoading: usersLoading, refreshUsers } = useFetchUsers();
  const {
    updateUser,
    isUpdating,
    error: updateError,
    isSuccess: updateSuccess,
  } = useUpdateUser();
  const {
    deleteUser,
    isDeleting: isDeletingUser,
    error: deleteError,
    isSuccess: deleteSuccess,
  } = useDeleteUser();
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <button
            onClick={() => {
              const modal = document.getElementById(
                "add-user-modal"
              ) as HTMLDialogElement;
              modal?.showModal();
            }}
            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New User
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">IDA Admin</h3>
          <div className="space-y-2">
            {usersLoading ? (
              <p>Loading users...</p>
            ) : (
              <>
                <Table
                  headers={["Name", "Username", "Email", "Edit", "Delete"]}
                  rows={users.map((user) => {
                    console.log("User data:", user);
                    return {
                      Name: `${user.first_name} ${user.last_name}`,
                      Username: user.username,
                      Email: user.email,
                      Edit: (
                        <button
                          className="btn btn-warning"
                          onClick={() => {
                            // TODO: Implement edit functionality
                            console.log("Edit user:", user.id);
                          }}
                        >
                          Edit
                        </button>
                      ),
                      Delete: (
                        <button
                          className="btn btn-error"
                          onClick={async () => {
                            try {
                              await deleteUser(user.id);
                              refreshUsers();
                            } catch (error) {
                              console.error("Error deleting user:", error);
                            }
                          }}
                        >
                          Delete
                        </button>
                      ),
                    };
                  })}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {deleteSuccess && (
        <Toast
          message="User deleted successfully!"
          color="success"
          duration={3000}
          onClose={() => {}}
        />
      )}
      {updateSuccess && (
        <Toast
          message="User updated successfully!"
          color="success"
          duration={3000}
          onClose={() => {}}
        />
      )}
      {deleteError && (
        <Toast
          message={`Error deleting user: ${deleteError}`}
          color="error"
          duration={5000}
          onClose={() => {}}
        />
      )}
      {updateError && (
        <Toast
          message={`Error updating user: ${updateError}`}
          color="error"
          duration={5000}
          onClose={() => {}}
        />
      )}
    </>
  );
};

export default Users;
