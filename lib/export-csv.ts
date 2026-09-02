/**
 * Helper to escape CSV cell contents properly
 */
export function escapeCsvCell(cell: unknown): string {
  if (cell === null || cell === undefined) return '""';
  const str = typeof cell === "object" ? JSON.stringify(cell) : String(cell);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Generate CSV string from headers and rows
 */
export function generateCsv(headers: string[], rows: (string | number | boolean | null | undefined)[][]): string {
  const headerRow = headers.map(escapeCsvCell).join(",");
  const dataRows = rows.map((row) => row.map(escapeCsvCell).join(","));
  return [headerRow, ...dataRows].join("\r\n");
}
