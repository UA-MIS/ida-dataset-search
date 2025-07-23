import React, { useState } from "react";

interface AccessInfo {
  field: string;
  value: string;
}

interface AddAccessInfoFormProps {
  accessInfoList: AccessInfo[];
  setAccessInfoList: React.Dispatch<React.SetStateAction<AccessInfo[]>>;
}

const AddAccessInfoForm: React.FC<AddAccessInfoFormProps> = ({
  accessInfoList,
  setAccessInfoList,
}) => {
  const [field, setField] = useState("");
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (field.trim() && value.trim()) {
      setAccessInfoList([...accessInfoList, { field, value }]);
      setField("");
      setValue("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-2">
      <h3 className="text-lg font-semibold mb-4 text-red-800">
        Add Access Info Field
      </h3>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Field"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="flex-1 border-2 border-red-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-base bg-white shadow-sm transition-all duration-150"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 border-2 border-red-200 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 text-base bg-white shadow-sm transition-all duration-150"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-6 py-3 bg-red-800 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors text-base flex items-center gap-2"
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
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAccessInfoForm;
