"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Entry } from "@/types";
import { getDrink } from "@/constants/drinks";
import { QTY_BY_ID } from "@/constants/quantities";
import { CONSUMER_LABEL } from "@/constants/consumers";
import { formatDate, formatTime } from "@/lib/format";

export function HistoryRow({
  entry,
  onEdit,
  onDelete,
}: {
  entry: Entry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const drink = getDrink(entry.drinkId);
  const qty = QTY_BY_ID[entry.quantityId];

  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
      <span
        className="h-9 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: drink.color }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-ink">{drink.name}</span>
          <span className="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-xs font-medium text-muted">
            {qty?.short ?? `${entry.ml} ml`}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
          <span>
            {formatDate(entry.ts)} {formatTime(entry.ts)}
          </span>
          <span aria-hidden>•</span>
          <span
            className={
              {
                kuhinja: "text-amber-400",
                konobari: "text-sky-400",
                lana: "text-violet-400",
                drazen: "text-rose-400",
              }[entry.consumer]
            }
          >
            {CONSUMER_LABEL[entry.consumer]}
          </span>
          {entry.note && (
            <>
              <span aria-hidden>•</span>
              <span className="truncate">{entry.note}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Ispravi zapis"
          className="rounded-lg p-2 text-muted transition active:scale-90 hover:text-ink"
        >
          <Pencil size={18} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Obriši zapis"
          className="rounded-lg p-2 text-muted transition active:scale-90 hover:text-danger"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
