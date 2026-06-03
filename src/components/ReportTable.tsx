import type { DrinkTotal } from "@/lib/aggregate";
import { formatQty } from "@/lib/format";

export function ReportTable({
  title,
  rows,
  totalCount,
  totalMl,
}: {
  title: string;
  rows: DrinkTotal[];
  totalCount: number;
  totalMl: number;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <h3 className="border-b border-line bg-surface-2 px-4 py-2.5 text-sm font-bold text-ink">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-sm text-muted">Nema unosa.</p>
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((r) => (
            <li
              key={r.drinkId}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
            >
              <span className="text-ink">{r.name}</span>
              <span className="font-semibold tabular-nums text-ink">
                {formatQty(r.count, r.ml)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
        <span className="text-sm font-bold text-ink">Ukupno</span>
        <span className="font-bold tabular-nums text-accent">
          {formatQty(totalCount, totalMl)}
        </span>
      </div>
    </section>
  );
}
