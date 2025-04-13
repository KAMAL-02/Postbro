import React from "react";
import { useResponseStore } from "@/utils/store/responseStore";

interface HeadersTableProps {
  tabId: string;
}

const ResponseHeaders = ({ tabId }: HeadersTableProps) => {
  const { responses } = useResponseStore();
  const responseData = responses[tabId];
  const { headers } = responseData || {};

  if (!headers || Object.keys(headers).length === 0) {
    return (
      <p className="text-xs text-gray-400 flex items-center">
        No headers available
      </p>
    );
  }

  return (
    <div className="overflow-auto rounded-lg pb-4">
      <table className="min-w-full text-sm text-left table-fixed">
        <thead className="text-gray-400">
          <tr>
            <th className="px-3 py-1 font-semibold w-1/3">Key</th>
            <th className="px-3 py-1 font-semibold w-2/3">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(headers).map(([key, value]) => (
            <tr
              key={key}
              className="text-xs text-gray-300"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              <td className="px-3 py-2 break-words whitespace-normal align-top">
                {key}
              </td>
              <td className="px-3 py-2 break-words whitespace-normal align-top">
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseHeaders;
