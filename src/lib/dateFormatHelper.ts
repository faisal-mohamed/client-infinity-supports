export function formatDateForStorage(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

/** Converts from DD-MM-YYYY → YYYY-MM-DD */
export function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[2].length === 4) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}