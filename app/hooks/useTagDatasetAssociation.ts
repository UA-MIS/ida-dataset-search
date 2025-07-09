import { useState, useEffect } from "react";
import { Tag } from "@/app/types";

export function useTagDatasetAssociation(
  datasets: any[],
  refreshTags: () => void
) {
  const [associateTag, setAssociateTag] = useState<Tag | null>(null);
  const [associateLoading, setAssociateLoading] = useState(false);
  const [associateSelected, setAssociateSelected] = useState<any[]>([]);
  const [originalAssociateSelected, setOriginalAssociateSelected] = useState<
    any[]
  >([]);
  const [associateSuccess, setAssociateSuccess] = useState(false);

  // Open modal and fetch current associations
  const openAssociate = async (tag: Tag) => {
    setAssociateLoading(true);
    setAssociateTag(tag);
    // Fetch all dataset_tags
    const res = await fetch(`/api/dataset_tags`);
    const allRelations = await res.json();
    // Filter for this tag's relations
    const tagRelations = (allRelations || []).filter(
      (rel: any) => rel.tag_id === tag.id
    );
    // Map all datasets to options
    const allDatasetOptions = (datasets || []).map((d) => ({
      value: d.id,
      label: d.title,
    }));
    // Only select datasets that are associated with this tag
    const selected = allDatasetOptions.filter((opt) =>
      tagRelations.some((rel: any) => rel.dataset_id === opt.value)
    );
    setOriginalAssociateSelected(selected);
    setAssociateSelected(selected);
    setAssociateLoading(false);
  };

  // Listen for dialog close event to reset state
  useEffect(() => {
    const modal = document.getElementById(
      "associate-modal"
    ) as HTMLDialogElement;
    if (!modal) return;
    const handleClose = () => {
      setAssociateTag(null);
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
      "associate-modal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  const handleAssociateSubmit = async (selected: any[]) => {
    if (!associateTag) return;
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
        await fetch("/api/dataset_tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataset_id, tag_id: associateTag.id }),
        });
      } catch (err) {
        console.error("Failed to add association", err);
      }
    }
    // DELETE removed associations
    for (const dataset_id of toRemove) {
      try {
        await fetch(`/api/dataset_tags/${dataset_id}/${associateTag.id}`, {
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
        "associate-modal"
      ) as HTMLDialogElement;
      modal?.close();
      setAssociateTag(null);
      setAssociateSuccess(false);
      refreshTags();
    }, 1200);
  };

  return {
    openAssociate,
    associateTag,
    associateSelected,
    setAssociateSelected,
    associateLoading,
    associateSuccess,
    handleAssociateSubmit,
    handleAssociateCancel,
    originalAssociateSelected,
  };
}
