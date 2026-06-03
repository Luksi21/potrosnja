"use client";

import { useState } from "react";
import { DrinkGrid } from "@/components/DrinkGrid";
import { EntrySheet } from "@/components/EntrySheet";

export default function UnosPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-ink">Unos</h1>
        <p className="text-sm text-muted">Dodirni piće za brzu evidenciju.</p>
      </header>

      <DrinkGrid onSelect={setSelected} />

      <EntrySheet drinkId={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
