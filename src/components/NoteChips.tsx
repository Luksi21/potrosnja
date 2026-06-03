"use client";

import { NOTE_SUGGESTIONS } from "@/constants/consumers";

export function NoteChips({ onPick }: { onPick: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {NOTE_SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          className="select-none rounded-full bg-surface-2 px-3 py-1.5 text-sm text-muted ring-1 ring-line transition active:scale-95 hover:text-ink"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
