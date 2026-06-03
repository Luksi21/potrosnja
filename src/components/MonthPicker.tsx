"use client";

interface Props {
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
  max?: string;
}

export function MonthPicker({ value, onChange, max }: Props) {
  return (
    <input
      type="month"
      value={value}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Odaberi mjesec"
      className="rounded-xl border border-line bg-surface px-3 py-3 text-base font-semibold text-ink focus:border-accent focus:outline-none"
    />
  );
}
