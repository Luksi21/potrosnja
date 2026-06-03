"use client";

interface Option<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
  ariaLabel?: string;
}

/** Big, single-select segmented buttons (≥56px tall) for fast thumb taps. */
export function SegmentButtons<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
  ariaLabel,
}: Props<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const selected = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={selected}
            className={`min-h-14 select-none rounded-xl px-3 py-3 text-base font-semibold transition active:scale-95 ${
              selected
                ? "bg-accent text-black ring-2 ring-accent"
                : "bg-surface-2 text-ink ring-1 ring-line"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
