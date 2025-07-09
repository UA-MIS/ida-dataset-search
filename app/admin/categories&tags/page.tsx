"use client";
import { Category, Tag } from "@/app/types";
import React, { useEffect, useState } from "react";
import Modal from "@/app/components/Modal";
import ItemCreationWizard from "@/app/components/ItemCreationWizard";
import SearchBar from "@/app/components/Searchbar";
import { useSearchbar } from "@/app/hooks/useSearchbar";
import NoResultsMessage from "@/app/components/NoResultsMessage";
import Table from "@/app/components/Table";
import AssociateItemForm from "@/app/components/AssociateItemForm";
import { useFetchDatasets } from "@/app/hooks/useFetchDatasets";
import { useModal } from "@/app/hooks/useModal";
import SuccessMessage from "@/app/components/SuccessMessage";
import { useTagDatasetAssociation } from "@/app/hooks/useTagDatasetAssociation";
import { useCategoryDatasetAssociation } from "@/app/hooks/useCategoryDatasetAssociation";
import ConfirmationMessage from "@/app/components/ConfirmationMessage";
import { useDeleteTag } from "@/app/hooks/useDeleteTag";
import { useDeleteCategory } from "@/app/hooks/useDeleteCategory";
import EditItemForm from "@/app/components/EditItemForm";

const CategoriesTags = () => {
  const [formKey, setFormKey] = React.useState(0);
  const [adminTags, setAdminTags] = React.useState<Tag[]>([]);
  const [adminCategories, setAdminCategories] = React.useState<Category[]>([]);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
  const [deletingTag, setDeletingTag] = React.useState<Tag | null>(null);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null
  );
  const [deletingCategory, setDeletingCategory] =
    React.useState<Category | null>(null);
  const { datasets, isLoading: datasetsLoading } = useFetchDatasets();
  const [isClient, setIsClient] = useState(false);

  const refreshTags = () => {
    fetch("/api/tags?withUsage=true")
      .then((res) => res.json())
      .then((data) => setAdminTags(data));
  };

  const refreshCategories = () => {
    fetch("/api/categories?withUsage=true")
      .then((res) => res.json())
      .then((data) => setAdminCategories(data));
  };

  const { deleteTag, isDeleting: deleteLoading } = useDeleteTag(refreshTags);
  const { deleteCategory, isDeleting: deleteCategoryLoading } =
    useDeleteCategory(refreshCategories);

  useEffect(() => {
    refreshTags();
    refreshCategories();
  }, []);

  const {
    openAssociate,
    associateTag,
    associateSelected,
    setAssociateSelected,
    associateLoading,
    associateSuccess,
    handleAssociateSubmit,
    handleAssociateCancel,
  } = useTagDatasetAssociation(datasets || [], refreshTags);

  const {
    openAssociate: openAssociateCategory,
    associateCategory,
    associateSelected: associateSelectedCategory,
    setAssociateSelected: setAssociateSelectedCategory,
    associateLoading: associateLoadingCategory,
    associateSuccess: associateSuccessCategory,
    handleAssociateSubmit: handleAssociateSubmitCategory,
    handleAssociateCancel: handleAssociateCancelCategory,
  } = useCategoryDatasetAssociation(datasets || [], refreshCategories);

  const handleTagModalClose = () => {
    const modal = document.getElementById(
      "create-tag-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setFormKey((k) => k + 1);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(null);
    setTimeout(() => {
      setEditingTag(tag);
      useModal("edit-tag-modal");
    }, 0);
  };

  const handleEditTagSuccess = () => {
    const modal = document.getElementById(
      "edit-tag-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setEditingTag(null);
    refreshTags();
  };

  const handleEditTagCancel = () => {
    const modal = document.getElementById(
      "edit-tag-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setEditingTag(null);
  };

  const handleDeleteTag = async (tag: Tag) => {
    const success = await deleteTag(tag.id);
    if (success) {
      setDeletingTag(null);
      const modal = document.getElementById(
        "delete-tag-modal"
      ) as HTMLDialogElement;
      modal?.close();
    }
  };

  const confirmDeleteTag = (tag: Tag) => {
    setDeletingTag(tag);
    useModal("delete-tag-modal");
  };

  const cancelDeleteTag = () => {
    setDeletingTag(null);
    const modal = document.getElementById(
      "delete-tag-modal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  const handleCategoryModalClose = () => {
    const modal = document.getElementById(
      "create-category-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setFormKey((k) => k + 1);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(null);
    setTimeout(() => {
      setEditingCategory(category);
      useModal("edit-category-modal");
    }, 0);
  };

  const handleEditCategorySuccess = () => {
    const modal = document.getElementById(
      "edit-category-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setEditingCategory(null);
    refreshCategories();
  };

  const handleEditCategoryCancel = () => {
    const modal = document.getElementById(
      "edit-category-modal"
    ) as HTMLDialogElement;
    modal?.close();
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (category: Category) => {
    const success = await deleteCategory(category.id);
    if (success) {
      setDeletingCategory(null);
      const modal = document.getElementById(
        "delete-category-modal"
      ) as HTMLDialogElement;
      modal?.close();
    }
  };

  const confirmDeleteCategory = (category: Category) => {
    setDeletingCategory(category);
    useModal("delete-category-modal");
  };

  const cancelDeleteCategory = () => {
    setDeletingCategory(null);
    const modal = document.getElementById(
      "delete-category-modal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { handleSearch, filteredItems: filteredTags } = useSearchbar(
    adminTags,
    "name"
  );
  const {
    handleSearch: handleSearchCategory,
    filteredItems: filteredCategories,
  } = useSearchbar(adminCategories, "name");

  React.useEffect(() => {
    const modal = document.getElementById(
      "create-tag-modal"
    ) as HTMLDialogElement;
    if (!modal) return;

    const handleClose = () => setFormKey((k) => k + 1);

    modal.addEventListener("close", handleClose);
    return () => {
      modal.removeEventListener("close", handleClose);
    };
  }, []);

  React.useEffect(() => {
    const modal = document.getElementById(
      "create-category-modal"
    ) as HTMLDialogElement;
    if (!modal) return;

    const handleClose = () => setFormKey((k) => k + 1);

    modal.addEventListener("close", handleClose);
    return () => {
      modal.removeEventListener("close", handleClose);
    };
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tags and Categories</h2>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              onClick={() => {
                useModal("create-category-modal");
              }}
            >
              Add Category
            </button>
            <button
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              onClick={() => {
                useModal("create-tag-modal");
              }}
            >
              Add New Tag
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Categories</h3>
            <SearchBar
              onSearch={handleSearchCategory}
              placeholder="Search categories..."
            />
            <br />
            {filteredCategories.length === 0 ? (
              <NoResultsMessage
                title="No Categories Found"
                message="We couldn't find any categories matching your search criteria. Try adjusting your search terms."
              />
            ) : (
              <Table
                headers={["Name", "Associated Datasets", "Actions"]}
                rows={filteredCategories.map((category: Category) => ({
                  Name: category.name,
                  "Associated Datasets": category.usage_count ?? 0,
                  Actions: (
                    <div className="flex gap-4">
                      <button
                        className="text-blue-500 hover:underline transition-colors"
                        onClick={() => {
                          openAssociateCategory(category);
                          useModal("associate-category-modal");
                        }}
                      >
                        Associate
                      </button>
                      <button
                        className="text-yellow-400 hover:underline transition-colors"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline transition-colors"
                        onClick={() => confirmDeleteCategory(category)}
                      >
                        Delete
                      </button>
                    </div>
                  ),
                }))}
              />
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <SearchBar onSearch={handleSearch} placeholder="Search tags..." />
            <br />
            {filteredTags.length === 0 ? (
              <NoResultsMessage
                title="No Tags Found"
                message="We couldn't find any tags matching your search criteria. Try adjusting your search terms."
              />
            ) : (
              <Table
                headers={["Name", "Associated Datasets", "Actions"]}
                rows={filteredTags.map((tag: Tag) => ({
                  Name: tag.name,
                  "Associated Datasets": tag.usage_count ?? 0,
                  Actions: (
                    <div className="flex gap-4">
                      <button
                        className="text-blue-500 hover:underline transition-colors"
                        onClick={() => {
                          openAssociate(tag);
                          useModal("associate-modal");
                        }}
                      >
                        Associate
                      </button>
                      <button
                        className="text-yellow-400 hover:underline transition-colors"
                        onClick={() => handleEditTag(tag)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline transition-colors"
                        onClick={() => confirmDeleteTag(tag)}
                      >
                        Delete
                      </button>
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        id="create-tag-modal"
        header="Create New Tag"
        body={
          <ItemCreationWizard
            key={formKey}
            itemType="tag"
            modalId="create-tag-modal"
            onSuccess={handleTagModalClose}
          />
        }
        size="xl"
      />
      <Modal
        id="associate-modal"
        header={`Associate Datasets with "${associateTag?.name}"`}
        body={
          associateSuccess ? (
            <SuccessMessage message="Associations updated!" />
          ) : (
            <AssociateItemForm
              key={formKey}
              allDatasets={(datasets || []).map((d) => ({
                value: d.id,
                label: d.title,
              }))}
              selectedDatasets={associateSelected}
              onChange={setAssociateSelected}
              onSubmit={handleAssociateSubmit}
              loading={associateLoading || datasetsLoading}
              mode="edit"
              modalId="associate-modal"
            />
          )
        }
        size="xl"
        height="h-3/4"
      />
      <Modal
        id="edit-tag-modal"
        header="Edit Tag"
        body={
          editingTag ? (
            <EditItemForm
              key={editingTag.id}
              item={editingTag}
              itemType="tag"
              onSuccess={handleEditTagSuccess}
              onCancel={handleEditTagCancel}
            />
          ) : (
            <div>Loading...</div>
          )
        }
        size="md"
      />
      <Modal
        id="delete-tag-modal"
        header="Delete Tag"
        body={
          deletingTag ? (
            <ConfirmationMessage
              title="Delete Tag"
              message={`Are you sure you want to delete the tag "${deletingTag.name}"? This action cannot be undone.`}
              confirmText="Delete Tag"
              cancelText="Cancel"
              variant="danger"
              onConfirm={() => handleDeleteTag(deletingTag)}
              onCancel={cancelDeleteTag}
              loading={deleteLoading}
            />
          ) : (
            <div>Loading...</div>
          )
        }
        size="md"
      />
      <Modal
        id="create-category-modal"
        header="Create New Category"
        body={
          <ItemCreationWizard
            key={formKey}
            itemType="category"
            modalId="create-category-modal"
            onSuccess={handleCategoryModalClose}
          />
        }
        size="xl"
      />
      <Modal
        id="associate-category-modal"
        header={`Associate Datasets with "${associateCategory?.name}"`}
        body={
          associateSuccessCategory ? (
            <SuccessMessage message="Associations updated!" />
          ) : (
            <AssociateItemForm
              key={formKey}
              allDatasets={(datasets || []).map((d) => ({
                value: d.id,
                label: d.title,
              }))}
              selectedDatasets={associateSelectedCategory}
              onChange={setAssociateSelectedCategory}
              onSubmit={handleAssociateSubmitCategory}
              loading={associateLoadingCategory || datasetsLoading}
              mode="edit"
              modalId="associate-category-modal"
            />
          )
        }
        size="xl"
        height="h-3/4"
      />
      <Modal
        id="edit-category-modal"
        header="Edit Category"
        body={
          editingCategory ? (
            <EditItemForm
              key={editingCategory.id}
              item={editingCategory}
              itemType="category"
              onSuccess={handleEditCategorySuccess}
              onCancel={handleEditCategoryCancel}
            />
          ) : (
            <div>Loading...</div>
          )
        }
        size="md"
      />
      <Modal
        id="delete-category-modal"
        header="Delete Category"
        body={
          deletingCategory ? (
            <ConfirmationMessage
              title="Delete Category"
              message={`Are you sure you want to delete the category "${deletingCategory.name}"? This action cannot be undone.`}
              confirmText="Delete Category"
              cancelText="Cancel"
              variant="danger"
              onConfirm={() => handleDeleteCategory(deletingCategory)}
              onCancel={cancelDeleteCategory}
              loading={deleteCategoryLoading}
            />
          ) : (
            <div>Loading...</div>
          )
        }
        size="md"
      />
    </>
  );
};

export default CategoriesTags;
