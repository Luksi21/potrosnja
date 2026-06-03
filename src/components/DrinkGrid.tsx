"use client";

import { DRINKS } from "@/constants/drinks";
import { DrinkCard } from "./DrinkCard";

export function DrinkGrid({ onSelect }: { onSelect: (drinkId: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {DRINKS.map((d) => (
        <DrinkCard key={d.id} drink={d} onClick={() => onSelect(d.id)} />
      ))}
    </div>
  );
}
