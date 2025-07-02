import React from "react";

interface Props {
  tag: string;
}

const DataTag = ({ tag }: Props) => {
  return <div className="badge badge-error">{tag}</div>;
};

export default DataTag;