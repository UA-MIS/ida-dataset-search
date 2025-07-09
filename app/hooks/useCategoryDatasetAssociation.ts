import { useState, useEffect } from "react";
import { Category } from "@/app/types";

export function useCategoryDatasetAssociation(
  datasets: any[],
  refreshCategories: () => void
) {
  const [associateCategory, setAssociateCategory] = useState<Category | null>(null);
  const [associateLoading, setAssociateLoading] = useState(false);
  const [associateSelected, setAssociateSelected] = useState<any[]>([]);
  const [originalAssociateSelected, setOriginalAssociateSelected] = useState<
    any[]
  >([]);
  const [associateSuccess, setAssociateSuccess] = useState(false);

  // Open modal and fetch current associations
  const openAssociate = async (category: Category) => {
    setAssociateLoading(true);
    setAssociateCategory(category);
    // Fetch all dataset_categories
    const res = await fetch(`/api/dataset_categories`);
    const allRelations = await res.json();
    // Filter for this category's relations
    const categoryRelations = (allRelations || []).filter(
      (rel: any) => rel.category_id === category.id
    );
    // Map all datasets to options
    const allDatasetOptions = (datasets || []).map((d) => ({
      value: d.id,
      label: d.title,
    }));
    // Only select datasets that are associated with this category
    const selected = allDatasetOptions.filter((opt) =>
      categoryRelations.some((rel: any) => rel.dataset_id === opt.value)
    );
    setOriginalAssociateSelected(selected);
    setAssociateSelected(selected);
    setAssociateLoading(false);
  };

  // Listen for dialog close event to reset state
  useEffect(() => {
    const modal = document.getElementById(
      "associate-category-modal"
    ) as HTMLDialogElement;
    if (!modal) return;
    const handleClose = () => {
      setAssociateCategory(null);
      setAssociateSuccess(false);
    };
    modal.addEventListener("close", handleClose);
    return () => {
      modal.removeEventListener("close", handleClose);
    };
  }, []);

  const handleAssociateCancel = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const modal = document.getElementById(
      "associate-category-modal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  const handleAssociateSubmit = async (selected: any[]) => {
    if (!associateCategory) return;
    setAssociateLoading(true);
    // Get previous and new dataset IDs
    const prevIds = new Set(originalAssociateSelected.map((d) => d.value));
    const newIds = new Set(selected.map((d) => d.value));
    // Find to add and to remove
    const toAdd = [...newIds].filter((id) => !prevIds.has(id));
    const toRemove = [...prevIds].filter((id) => !newIds.has(id));
    // POST new associations
    for (const dataset_id of toAdd) {
      try {
        await fetch("/api/dataset_categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataset_id, category_id: associateCategory.id }),
        });
      } catch (err) {
        console.error("Failed to add association", err);
      }
    }
    // DELETE removed associations
    for (const dataset_id of toRemove) {
      try {
        await fetch(`/api/dataset_categories/${dataset_id}/${associateCategory.id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete association", err);
      }
    }
    setAssociateLoading(false);
    setAssociateSuccess(true);
    setTimeout(() => {
      const modal = document.getElementById(
        "associate-category-modal"
      ) as HTMLDialogElement;
      modal?.close();
      setAssociateCategory(null);
      setAssociateSuccess(false);
      refreshCategories();
    }, 1200);
  };

  return {
    openAssociate,
    associateCategory,
    associateSelected,
    setAssociateSelected,
    associateLoading,
    associateSuccess,
    handleAssociateSubmit,
    handleAssociateCancel,
    originalAssociateSelected,
  };
}
