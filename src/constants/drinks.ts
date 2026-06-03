import type { Drink } from "@/types";

/** The 14 drinks from the spec, in order. Colors are brand approximations. */
export const DRINKS: Drink[] = [
  { id: "sprite", name: "Sprite", color: "#0A8A3C", category: "soda" },
  { id: "coca-cola", name: "Coca Cola", color: "#E61A27", category: "soda" },
  {
    id: "coca-cola-zero",
    name: "Coca Cola Zero",
    color: "#1A1A1A",
    textColor: "#ffffff",
    category: "soda",
  },
  { id: "fanta", name: "Fanta", color: "#FF8200", category: "soda" },
  { id: "jamnica", name: "Jamnica", color: "#0072CE", category: "water" },
  {
    id: "aqua-panna-velika",
    name: "Aqua Panna Velika",
    color: "#6E4A2A",
    category: "water",
  },
  {
    id: "aqua-panna-mala",
    name: "Aqua Panna Mala",
    color: "#8A6A45",
    category: "water",
  },
  {
    id: "san-pellegrino-velika",
    name: "San Pellegrino Velika",
    color: "#C8102E",
    category: "water",
  },
  {
    id: "san-pellegrino-mala",
    name: "San Pellegrino Mala",
    color: "#E0455E",
    category: "water",
  },
  { id: "vocni-sokovi", name: "Voćni Sokovi", color: "#F4A300", category: "juice" },
  { id: "crno-vino", name: "Crno Vino", color: "#6B1020", category: "wine" },
  {
    id: "bijelo-vino",
    name: "Bijelo Vino",
    color: "#C9B458",
    textColor: "#1a1a1a",
    category: "wine",
  },
  { id: "ballantines", name: "Ballantine's", color: "#0E5A2B", category: "spirit" },
  { id: "vodka", name: "Vodka", color: "#4A6275", category: "spirit" },
  // Added from the May 2026 consumption log (not in the original list).
  { id: "tonic", name: "Tonic", color: "#5E7382", category: "soda" },
  {
    id: "tonic-schweppes",
    name: "Tonic Schweppes",
    color: "#C9A227",
    textColor: "#1a1a1a",
    category: "soda",
  },
  { id: "schweppes-bitter", name: "Schweppes Bitter", color: "#B23A48", category: "soda" },
  { id: "cappuccino", name: "Cappuccino", color: "#6F4E37", category: "coffee" },
  { id: "espresso", name: "Espresso", color: "#3B2417", category: "coffee" },
];

export const DRINK_BY_ID: Record<string, Drink> = Object.fromEntries(
  DRINKS.map((d) => [d.id, d]),
);

/** Safe lookup with a fallback for entries whose drink was removed/renamed. */
export function getDrink(id: string): Drink {
  return (
    DRINK_BY_ID[id] ?? {
      id,
      name: id,
      color: "#3a4654",
      category: "soda",
    }
  );
}
