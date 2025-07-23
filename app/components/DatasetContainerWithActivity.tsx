import React from "react";
import DatasetContainer from "./DatasetContainer";
import { useDatasetActivity } from "../hooks/useDatasetActivity";
import { Dataset } from "@/app/types";

interface Props {
  dataset: Dataset;
  onEdit: (dataset: Dataset) => void;
}

const DatasetContainerWithActivity = ({ dataset, onEdit }: Props) => {
  const { active, loading, error, toggleActivity } = useDatasetActivity(
    dataset.id,
    dataset.isActive === "T"
  );
  return (
    <DatasetContainer
      title={dataset.title}
      categories={dataset.categories || []}
      tags={dataset.tags || []}
      active={active}
      onActivate={toggleActivity}
      onEdit={() => onEdit(dataset)}
    />
  );
};

export default DatasetContainerWithActivity;
