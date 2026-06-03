"use client";

import type { Drink } from "@/types";
import { BottleIcon } from "./BottleIcon";

export function DrinkCard({
  drink,
  onClick,
}: {
  drink: Drink;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={drink.name}
      className="relative flex min-h-[104px] select-none flex-col items-start justify-end overflow-hidden rounded-2xl p-3 text-left shadow-sm ring-1 ring-white/10 transition active:scale-95"
      style={{ backgroundColor: drink.color, color: drink.textColor ?? "#ffffff" }}
    >
      <BottleIcon className="pointer-events-none absolute -right-3 -top-2 h-24 w-24 opacity-25" />
      <span className="relative text-sm font-bold leading-tight drop-shadow-sm">
        {drink.name}
      </span>
    </button>
  );
}
