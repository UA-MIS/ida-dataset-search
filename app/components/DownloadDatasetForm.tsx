import React, { useEffect, useState } from "react";
import { FaFileAlt, FaCode, FaDownload } from "react-icons/fa";

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
    return <div className="text-gray-500 text-center py-4">Loading...</div>;
  }

  return (
    <div className="text-center">
      {datasetName && (
        <p className="text-sm text-gray-500 mb-6">
          Choose a format for{" "}
          <span className="font-semibold text-gray-900">{datasetName}</span>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={csvURL || ""}
          className="flex flex-col items-center gap-2 px-4 py-5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-medium transition-colors"
        >
          <FaFileAlt className="h-6 w-6" />
          <span className="text-sm">Download CSV</span>
        </a>
        <a
          href={jsonURL || ""}
          className="flex flex-col items-center gap-2 px-4 py-5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-200"
        >
          <FaCode className="h-6 w-6" />
          <span className="text-sm">Download JSON</span>
        </a>
      </div>
    </div>
  );
};

export default DownloadDatasetForm;
