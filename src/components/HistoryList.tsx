"use client";

import type { Entry } from "@/types";
import { HistoryRow } from "./HistoryRow";

export function HistoryList({
  entries,
  onEdit,
  onDelete,
}: {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {entries.map((e) => (
        <HistoryRow
          key={e.id}
          entry={e}
          onEdit={() => onEdit(e)}
          onDelete={() => onDelete(e)}
        />
      ))}
    </ul>
  );
}
