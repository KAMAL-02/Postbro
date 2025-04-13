import React from "react";

interface HeadersTableProps {
  headers: Record<string, string>;
}

const ResponseHeaders = ({ headers }: HeadersTableProps) => {
  if (!headers || Object.keys(headers).length === 0) {
    return <p className="text-xs text-gray-400 flex items-center">No headers available</p>;
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
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseHeaders;
