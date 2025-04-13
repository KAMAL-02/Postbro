"use client";

import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useRequestStore } from "@/utils/store/requestStore";

export default function BodyTypeDropdown({tabId}: {tabId: string}) {
  const { requests, setContentType, setHeaders } = useRequestStore();
  const requestData = requests[tabId] || { contentType: "" };
  const { contentType } = requestData;

  const handleChange = (e: any) => {
    const newContentType = e.value;
    setContentType(tabId, newContentType);
  
    const existingHeaders = requests[tabId]?.headers || [];
  
    // Check if there's already a content-type header (case-insensitive)
    const hasContentType = existingHeaders.findIndex(
      (h) => h.key?.toLowerCase() === "content-type"
    );
  
    let newHeaders;
  
    if (hasContentType !== -1) {
      // Replace the existing content-type header
      newHeaders = [...existingHeaders];
      newHeaders[hasContentType] = { key: "content-type", value: newContentType };
    } else {
      // Ensure content-type is at index 0
      newHeaders = [
        { key: "content-type", value: newContentType },
        ...existingHeaders.filter((h) => h.key?.toLowerCase() !== "content-type"),
      ];
    }
  
    setHeaders(tabId, newHeaders);
  };
  



  const options = [
    { label: "application/json", value: "application/json" },
    { label: "text/plain", value: "text/plain" },
    { label: "application/xml", value: "application/xml" },
    {
      label: "application/x-www-form-urlencoded",
      value: "application/x-www-form-urlencoded",
    },
    { label: "multipart/form-data", value: "multipart/form-data" },
    { label: "application/graphql", value: "application/graphql" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-400 mr-0.5 font-semibold">
        content-Type
      </span>
      <Dropdown
        value={contentType}
        options={options}
        onChange={handleChange}
        className="min-w-fit gap-2 max-w-[200px] text-[12px] font-medium text-gray-300 ml-1"
        panelClassName="bg-[#121212] text-white text-xs border border-zinc-800 p-2 rounded-md font-bold"
        itemTemplate={(option) => (
          <div className="py-2 px-2 font-medium">{option.label}</div>
        )}
      />
    </div>
  );
}
