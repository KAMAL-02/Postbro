"use client";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function BodyTypeDropdown() {
  const [bodyType, setBodyType] = useState("application/json");

  const options = [
    { label: "application/json", value: "application/json" },
    { label: "text/plain", value: "text/plain" },
    { label: "application/xml", value: "application/xml" },
    { label: "application/x-www-form-urlencoded", value: "application/x-www-form-urlencoded" },
    { label: "multipart/form-data", value: "multipart/form-data" },
    { label: "application/graphql", value: "application/graphql" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-400 mr-0.5 font-semibold">content-Type</span>
      <Dropdown
  value={bodyType}
  options={options}
  onChange={(e) => setBodyType(e.value)}
  className="min-w-fit gap-2 max-w-[200px] text-[12px] font-medium text-gray-300 ml-1"
  panelClassName="bg-[#121212] text-white text-xs border border-zinc-800 p-2 rounded-md font-bold"
  itemTemplate={(option) => (
    <div className="py-2 px-2 font-medium">{option.label}</div>
  )}
/>
    </div>
  );
}
