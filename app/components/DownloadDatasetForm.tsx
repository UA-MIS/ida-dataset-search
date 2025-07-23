import React, { useEffect, useState } from "react";

interface DownloadDatasetFormProps {
  datasetId?: number | null;
}

const DownloadDatasetForm: React.FC<DownloadDatasetFormProps> = ({
  datasetId,
}) => {
  const [datasetName, setDatasetName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [datasetType, setDatasetType] = useState<string | null>(null);
  const [csvURL, setCsvURL] = useState<string | null>(null);
  const [jsonURL, setJsonURL] = useState<string | null>(null);

  useEffect(() => {
    if (!datasetId) return;
    setLoading(true);
    fetch(`/api/datasets/${datasetId}`)
      .then((res) => res.json())
      .then((data) => {
        setDatasetName(data.title || "Database");
        setDatasetType(data.type || "API");
      })
      .finally(() => setLoading(false));
  }, [datasetId]);

  useEffect(() => {
    if (!datasetId || !datasetType) {
      setCsvURL(null);
      setJsonURL(null);
      return;
    }
    if (datasetType === "API") {
      setCsvURL(`/api/download/rest_api?datasetId=${datasetId}&format=csv`);
      setJsonURL(`/api/download/rest_api?datasetId=${datasetId}&format=json`);
    } else if (datasetType === "Database") {
      setCsvURL(`/api/download/database?datasetId=${datasetId}&format=csv`);
      setJsonURL(`/api/download/database?datasetId=${datasetId}&format=json`);
    } else if (datasetType === "FTP") {
      setCsvURL(`/api/download/ftp?datasetId=${datasetId}&format=csv`);
      setJsonURL(`/api/download/ftp?datasetId=${datasetId}&format=json`);
    }
  }, [datasetId, datasetType]);

  if (!datasetId) {
    return <div className="text-red-600">No dataset selected.</div>;
  }

  if (loading) {
    return <div className="text-gray-500">Loading dataset info...</div>;
  }

  return (
    <>
      <div className="text-lg font-semibold text-gray-700 mb-4">
        {datasetName ? (
          <>
            You are downloading:{" "}
            <span className="text-red-700">{datasetName}</span>
          </>
        ) : (
          <>Dataset selected</>
        )}
      </div>
      <div className="mb-6 text-gray-600 text-center">
        Please select the file type you want to download this dataset as:
      </div>
      <div className="flex gap-6">
        <a
          href={csvURL || ""}
          className="px-6 py-3 bg-red-800 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors text-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Download CSV
        </a>
        <a
          href={jsonURL || ""}
          className="px-6 py-3 bg-gray-200 text-red-800 rounded-lg font-semibold shadow hover:bg-gray-300 transition-colors text-lg flex items-center gap-2 border border-red-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Download JSON
        </a>
      </div>
    </>
  );
};

export default DownloadDatasetForm;
