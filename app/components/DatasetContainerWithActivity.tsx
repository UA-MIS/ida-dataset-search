import React from "react";
import DatasetContainer from "./DatasetContainer";
import { useDatasetActivity } from "../hooks/useDatasetActivity";
import { Dataset } from "@/app/types";

interface Props {
  dataset: Dataset;
  onEditDataset: (dataset: Dataset) => void;
  onEditAccessInfo: (dataset: Dataset) => void;
}

const DatasetContainerWithActivity = ({ dataset, onEditDataset, onEditAccessInfo }: Props) => {
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
      onEditDataset={() => onEditDataset(dataset)}
      onEditAccessInfo={() => onEditAccessInfo(dataset)}
    />
  );
};

export default DatasetContainerWithActivity;
