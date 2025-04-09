export const getSize = (data: any): string => {
  const str = typeof data === "string" ? data : JSON.stringify(data);
  const bytes = Buffer.byteLength(str, "utf8");

  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

  