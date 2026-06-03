"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Consumer, QuantityId } from "@/types";
import { CONSUMERS, DEFAULT_CONSUMER } from "@/constants/consumers";
import { DEFAULT_QUANTITY, QUANTITIES } from "@/constants/quantities";
import { getDrink } from "@/constants/drinks";
import { storage } from "@/lib/storage";
import { SegmentButtons } from "./SegmentButtons";
import { NoteChips } from "./NoteChips";
import { BottleIcon } from "./BottleIcon";
import { useToast } from "./Toast";

const QTY_OPTIONS = QUANTITIES.map((q) => ({ id: q.id, label: q.label }));

/**
 * Bottom-sheet entry form. Pre-selects the most common consumer + quantity so
 * the happy path is "tap drink → Evidentiraj" (2 taps, well under 5 seconds).
 */
export function EntrySheet({
  drinkId,
  onClose,
}: {
  drinkId: string | null;
  onClose: () => void;
}) {
  const { show } = useToast();
  const [consumer, setConsumer] = useState<Consumer>(DEFAULT_CONSUMER);
  const [quantity, setQuantity] = useState<QuantityId>(DEFAULT_QUANTITY);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const open = drinkId !== null;

  // Reset to defaults whenever a new drink opens the sheet.
  useEffect(() => {
    if (open) {
      setConsumer(DEFAULT_CONSUMER);
      setQuantity(DEFAULT_QUANTITY);
      setNote("");
      setSaving(false);
    }
  }, [drinkId, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !drinkId) return null;
  const drink = getDrink(drinkId);

  const submit = () => {
    if (saving) return;
    setSaving(true); // guards against double-tap → duplicate rows
    const saved = storage.add({ drinkId, quantityId: quantity, consumer, note });
    if (saved) {
      show(`Evidentirano: ${drink.name} ✓`);
      onClose();
    } else {
      setSaving(false);
      show("Greška pri spremanju (memorija puna?).", "error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Unos: ${drink.name}`}
    >
      <div className="fade-in absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sheet-pop relative w-full max-w-2xl rounded-t-3xl border-t border-line bg-surface p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-2xl">
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-white/10"
            style={{
              backgroundColor: drink.color,
              color: drink.textColor ?? "#ffffff",
            }}
          >
            <BottleIcon className="h-7 w-7" />
          </span>
          <h2 className="flex-1 text-xl font-bold text-ink">{drink.name}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="rounded-lg p-2 text-muted transition active:scale-90"
          >
            <X size={22} />
          </button>
        </div>

        <p className="mb-2 text-sm font-medium text-muted">Vrsta potrošnje</p>
        <SegmentButtons
          options={CONSUMERS}
          value={consumer}
          onChange={setConsumer}
          columns={2}
          ariaLabel="Vrsta potrošnje"
        />

        <p className="mb-2 mt-4 text-sm font-medium text-muted">Količina</p>
        <SegmentButtons
          options={QTY_OPTIONS}
          value={quantity}
          onChange={setQuantity}
          columns={2}
          ariaLabel="Količina"
        />

        <p className="mb-2 mt-4 text-sm font-medium text-muted">
          Napomena <span className="text-muted/60">(opcionalno)</span>
        </p>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="npr. Sos, Rižoto…"
          className="mb-2 w-full rounded-xl border border-line bg-surface-2 px-3 py-3 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <NoteChips onPick={setNote} />

        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="mt-5 min-h-14 w-full select-none rounded-xl bg-accent text-lg font-bold text-black transition active:scale-[0.98] disabled:opacity-60"
        >
          Evidentiraj
        </button>
      </div>
    </div>
  );
}
