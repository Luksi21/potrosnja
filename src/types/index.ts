export type Consumer = "kuhinja" | "konobari" | "lana" | "drazen";

export type DrinkCategory =
  | "soda"
  | "water"
  | "juice"
  | "wine"
  | "spirit"
  | "coffee";

export interface Drink {
  id: string; // stable slug, e.g. "coca-cola-zero"
  name: string; // display label
  color: string; // brand color (card background / accent)
  textColor?: string; // override when the brand color is light
  category: DrinkCategory;
}

export type QuantityId = "mala" | "koktel" | "velika" | "boca" | "komad";

export interface QuantityOption {
  id: QuantityId;
  label: string; // full label shown in the sheet, e.g. "Mala čaša (100 ml)"
  short: string; // compact label for history rows, e.g. "100 ml"
  ml: number; // volume in millilitres
}

export interface Entry {
  id: string; // crypto.randomUUID()
  ts: number; // epoch ms — source of truth
  day: string; // "YYYY-MM-DD" (local) — used for search/grouping
  month: string; // "YYYY-MM" (local) — used to bucket monthly reports
  drinkId: string; // → Drink.id
  quantityId: QuantityId;
  ml: number; // snapshot of the quantity volume at write time
  consumer: Consumer;
  note: string; // "" when empty
}

/** Shape accepted by storage.add() — the derived fields are computed there. */
export interface NewEntryInput {
  drinkId: string;
  quantityId: QuantityId;
  consumer: Consumer;
  note: string;
  ts?: number; // defaults to now
}
