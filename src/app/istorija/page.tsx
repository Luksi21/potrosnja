"use client";

import { useMemo, useState } from "react";
import type { Entry } from "@/types";
import { useEntries } from "@/hooks/useEntries";
import { SearchBar } from "@/components/SearchBar";
import { HistoryList } from "@/components/HistoryList";
import { EmptyState } from "@/components/EmptyState";
import { EditEntryDialog } from "@/components/EditEntryDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";
import { getDrink } from "@/constants/drinks";
import { CONSUMER_LABEL } from "@/constants/consumers";
import { formatDate } from "@/lib/format";

export default function IstorijaPage() {
  const { entries, hydrated, remove } = useEntries();
  const { show } = useToast();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Entry | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => {
      const drink = getDrink(e.drinkId).name.toLowerCase();
      return (
        drink.includes(q) ||
        e.note.toLowerCase().includes(q) ||
        CONSUMER_LABEL[e.consumer].toLowerCase().includes(q) ||
        formatDate(e.ts).includes(q)
      );
    });
  }, [entries, query]);

  const confirmDelete = () => {
    if (deleting) {
      remove(deleting.id);
      show("Zapis obrisan.");
    }
    setDeleting(null);
  };

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-ink">Istorija</h1>
        <p className="text-sm text-muted">Ukupno unosa: {entries.length}</p>
      </header>

      <div className="mb-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Pretraži piće, napomenu, datum…"
        />
      </div>

      {!hydrated ? (
        <p className="py-10 text-center text-sm text-muted">Učitavanje…</p>
      ) : entries.length === 0 ? (
        <EmptyState
          title="Još nema unosa."
          hint="Dodaj prvi unos na kartici „Unos”."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nema rezultata." hint="Promijeni pojam pretrage." />
      ) : (
        <HistoryList
          entries={filtered}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      )}

      <EditEntryDialog entry={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Obrisati zapis?"
        message={
          deleting
            ? `${getDrink(deleting.drinkId).name} — ${formatDate(deleting.ts)}`
            : undefined
        }
        confirmLabel="Obriši"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
