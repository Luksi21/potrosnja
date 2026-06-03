import type { Entry, NewEntryInput, QuantityId } from "@/types";
import { QTY_BY_ID } from "@/constants/quantities";
import { toLocalDay, toLocalMonth } from "@/lib/format";

const KEY = "potrosnja.entries.v1";

/** Fired after every write so mounted hooks (and other tabs) re-read. */
export const CHANGE_EVENT = "potrosnja:changed";

function read(): Entry[] {
  if (typeof window === "undefined") return []; // SSR / static export guard
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return []; // corrupt JSON → behave as empty rather than crash
  }
}

function write(entries: Entry[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    // Most likely QuotaExceededError — caller surfaces a toast.
    return false;
  }
}

function deriveDateFields(ts: number) {
  const d = new Date(ts);
  return { day: toLocalDay(d), month: toLocalMonth(d) };
}

export const storage = {
  getAll(): Entry[] {
    // newest first
    return read().sort((a, b) => b.ts - a.ts);
  },

  add(input: NewEntryInput): Entry | null {
    const ts = input.ts ?? Date.now();
    const entry: Entry = {
      id: crypto.randomUUID(),
      ts,
      ...deriveDateFields(ts),
      drinkId: input.drinkId,
      quantityId: input.quantityId,
      ml: QTY_BY_ID[input.quantityId].ml,
      consumer: input.consumer,
      note: input.note.trim(),
    };
    return write([entry, ...read()]) ? entry : null;
  },

  update(
    id: string,
    patch: Partial<{
      drinkId: string;
      quantityId: QuantityId;
      consumer: Entry["consumer"];
      note: string;
      ts: number;
    }>,
  ): boolean {
    const next = read().map((e) => {
      if (e.id !== id) return e;
      const merged: Entry = { ...e, ...patch, note: (patch.note ?? e.note).trim() };
      if (patch.quantityId) merged.ml = QTY_BY_ID[patch.quantityId].ml;
      if (patch.ts != null) Object.assign(merged, deriveDateFields(patch.ts));
      return merged;
    });
    return write(next);
  },

  remove(id: string): boolean {
    return write(read().filter((e) => e.id !== id));
  },

  byMonth(month: string): Entry[] {
    return read()
      .filter((e) => e.month === month)
      .sort((a, b) => b.ts - a.ts);
  },

  /** Distinct months that have entries, newest first — for the report picker. */
  availableMonths(): string[] {
    return [...new Set(read().map((e) => e.month))].sort().reverse();
  },

  /** Wholesale replace — used by the JSON import (restore). */
  replaceAll(entries: Entry[]): boolean {
    return write(entries);
  },
};
