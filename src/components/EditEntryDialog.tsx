"use client";

import { useEffect, useState } from "react";
import type { Consumer, Entry, QuantityId } from "@/types";
import { CONSUMERS } from "@/constants/consumers";
import { QUANTITIES } from "@/constants/quantities";
import { DRINKS } from "@/constants/drinks";
import { storage } from "@/lib/storage";
import { SegmentButtons } from "./SegmentButtons";
import { NoteChips } from "./NoteChips";
import { useToast } from "./Toast";

const QTY_OPTIONS = QUANTITIES.map((q) => ({ id: q.id, label: q.label }));

export function EditEntryDialog({
  entry,
  onClose,
}: {
  entry: Entry | null;
  onClose: () => void;
}) {
  const { show } = useToast();
  const [drinkId, setDrinkId] = useState("");
  const [consumer, setConsumer] = useState<Consumer>("kuhinja");
  const [quantity, setQuantity] = useState<QuantityId>("koktel");
  const [note, setNote] = useState("");

  const open = entry !== null;

  useEffect(() => {
    if (entry) {
      setDrinkId(entry.drinkId);
      setConsumer(entry.consumer);
      setQuantity(entry.quantityId);
      setNote(entry.note);
    }
  }, [entry]);

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

  if (!open || !entry) return null;

  const save = () => {
    storage.update(entry.id, { drinkId, consumer, quantityId: quantity, note });
    show("Zapis ažuriran ✓");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Ispravi zapis"
    >
      <div className="fade-in absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="sheet-pop relative w-full max-w-2xl rounded-t-3xl border-t border-line bg-surface p-5 pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-2xl sm:rounded-3xl sm:border">
        <h2 className="mb-4 text-xl font-bold text-ink">Ispravi zapis</h2>

        <p className="mb-2 text-sm font-medium text-muted">Piće</p>
        <select
          value={drinkId}
          onChange={(e) => setDrinkId(e.target.value)}
          className="mb-4 w-full rounded-xl border border-line bg-surface-2 px-3 py-3 text-base text-ink focus:border-accent focus:outline-none"
        >
          {DRINKS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <p className="mb-2 text-sm font-medium text-muted">Vrsta potrošnje</p>
        <SegmentButtons
          options={CONSUMERS}
          value={consumer}
          onChange={setConsumer}
          columns={2}
        />

        <p className="mb-2 mt-4 text-sm font-medium text-muted">Količina</p>
        <SegmentButtons
          options={QTY_OPTIONS}
          value={quantity}
          onChange={setQuantity}
          columns={2}
        />

        <p className="mb-2 mt-4 text-sm font-medium text-muted">Napomena</p>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="npr. Sos, Rižoto…"
          className="mb-2 w-full rounded-xl border border-line bg-surface-2 px-3 py-3 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <NoteChips onPick={setNote} />

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 flex-1 select-none rounded-xl bg-surface-2 font-semibold text-ink ring-1 ring-line transition active:scale-95"
          >
            Odustani
          </button>
          <button
            type="button"
            onClick={save}
            className="min-h-12 flex-1 select-none rounded-xl bg-accent font-bold text-black transition active:scale-95"
          >
            Spremi
          </button>
        </div>
      </div>
    </div>
  );
}
