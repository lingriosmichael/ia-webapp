const yearMonthPattern = /^(\d{4})-(\d{1,2})$/;
const monthYearPattern = /^(\d{1,2})\/(\d{4})$/;

function isValidMonthNumber(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 12;
}

function formatMonthValue(year: string, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function normalizeMonthValue(value: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const yearMonthMatch = yearMonthPattern.exec(trimmedValue);
  if (yearMonthMatch) {
    const year = yearMonthMatch[1]!;
    const monthValue = yearMonthMatch[2]!;
    const month = Number(monthValue);
    return isValidMonthNumber(month) ? formatMonthValue(year, month) : null;
  }

  const monthYearMatch = monthYearPattern.exec(trimmedValue);
  if (monthYearMatch) {
    const monthValue = monthYearMatch[1]!;
    const year = monthYearMatch[2]!;
    const month = Number(monthValue);
    return isValidMonthNumber(month) ? formatMonthValue(year, month) : null;
  }

  return null;
}
