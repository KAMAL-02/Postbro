import React from "react";

interface HeadersTableProps {
  headers: Record<string, string>;
}

const ResponseHeaders = ({ headers }: HeadersTableProps) => {
  if (!headers || Object.keys(headers).length === 0) {
    return <p className="text-sm text-muted-foreground">No headers available</p>;
  }

  return (
    <div className="overflow-auto rounded-lg pb-4">
      <table className="min-w-full text-sm text-left">
        <thead className="text-gray-400">
          <tr>
            <th className="px-3 py-1 font-semibold">Key</th>
            <th className="px-3 py-1 font-semibold">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(headers).map(([key, value]) => (
            <tr key={key} className="text-xs text-gray-300" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              <td className="px-3 py-2">{key}</td>
              <td className="px-3 py-2">{value as string}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseHeaders;
