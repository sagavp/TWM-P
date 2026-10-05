export function formatIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIso(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(fromIso, toIso) {
  return Math.round((parseIso(toIso) - parseIso(fromIso)) / 86400000);
}

export function addDays(iso, days) {
  const date = parseIso(iso);
  date.setDate(date.getDate() + days);
  return formatIso(date);
}

export function formatChileanDate(iso) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function expirationIso(fecha) {
  return addDays(fecha, 15);
}

export function shouldDeleteQuote(fecha, today) {
  return daysBetween(fecha, today) > 45;
}

export function displayedUnitPrice(stored, current, fecha, today) {
  if (daysBetween(fecha, today) <= 15) return stored;
  return current;
}
