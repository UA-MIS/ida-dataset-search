import React from "react";

interface Props {
  title: string;
  tags: string[];
  categories: string[];
  onDelete: () => void;
  onEdit: () => void;
}

const DatasetCard = ({ title, categories, tags, onDelete, onEdit }: Props) => {
  return (
    <>
      <div className="card bg-base-100 card-lg shadow-sm h-full hover:shadow-lg transition-shadow duration-300">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="text-sm text-gray-500">{categories.join(" | ")}</p>
          <p className="text-sm text-gray-500">Tags: {tags.join(", ")}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            ultrices eros lorem, eu auctor nisi egestas sed. Maecenas lorem leo,
            elementum quis congue vitae, dictum in augue. Etiam ac massa
            volutpat sem accumsan ultrices. Nulla id mi iaculis nisl ornare
            iaculis. Nam massa arcu, vestibulum at ultrices in, finibus nec
            elit. Pellentesque sed nunc ultricies, tristique lectus et, finibus
            odio. Suspendisse consectetur diam eros, id finibus sapien blandit
            vitae.
          </p>
          <br />
          <div className="flex gap-2">
            <button className="btn btn-outline btn-info">View</button>
            <button className="btn btn-outline btn-warning" onClick={onEdit}>
              Edit
            </button>
            <button className="btn btn-outline btn-error" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DatasetCard;
