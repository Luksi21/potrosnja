const pad2 = (n: number) => String(n).padStart(2, "0");

/** Local "YYYY-MM-DD" (never UTC — keeps day/month buckets correct across TZ/DST). */
export function toLocalDay(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Local "YYYY-MM". */
export function toLocalMonth(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

/** Current local month as "YYYY-MM" (for the report's default selection). */
export function currentMonth(): string {
  return toLocalMonth(new Date());
}

/** Volume in ml → liters, Croatian formatting, e.g. 1600 → "1,60 L". */
export function formatLiters(ml: number): string {
  return `${(ml / 1000).toLocaleString("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} L`;
}

/** Epoch ms → "dd.MM.yyyy." (local). */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}.`;
}

/** Epoch ms → "HH:mm" (local, 24h). */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

const CRO_MONTHS = [
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
];

/** "2026-06" → "Lipanj 2026." */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  const name = CRO_MONTHS[Number(m) - 1] ?? m;
  return `${name} ${y}.`;
}
