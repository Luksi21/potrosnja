import type { Entry } from "@/types";
import { DRINKS } from "@/constants/drinks";

export interface DrinkTotal {
  drinkId: string;
  name: string;
  ml: number;
}

export interface MonthReport {
  month: string;
  perDrink: DrinkTotal[]; // total per drink (both consumers)
  kuhinja: DrinkTotal[]; // total per drink — kitchen only
  konobari: DrinkTotal[]; // total per drink — waiters only
  totalKuhinjaMl: number;
  totalKonobariMl: number;
  totalMl: number;
  count: number; // number of entries in the month
}

/** Sum ml per drink, returned in canonical DRINKS order, only drinks used. */
function sumByDrink(rows: Entry[]): DrinkTotal[] {
  const totals = new Map<string, number>();
  for (const e of rows) {
    totals.set(e.drinkId, (totals.get(e.drinkId) ?? 0) + e.ml);
  }
  return DRINKS.filter((d) => totals.has(d.id)).map((d) => ({
    drinkId: d.id,
    name: d.name,
    ml: totals.get(d.id) ?? 0,
  }));
}

const sumMl = (rows: DrinkTotal[]) => rows.reduce((s, r) => s + r.ml, 0);

export function buildMonthReport(entries: Entry[], month: string): MonthReport {
  const inMonth = entries.filter((e) => e.month === month);
  const kuhinja = sumByDrink(inMonth.filter((e) => e.consumer === "kuhinja"));
  const konobari = sumByDrink(inMonth.filter((e) => e.consumer === "konobari"));
  const perDrink = sumByDrink(inMonth);

  return {
    month,
    perDrink,
    kuhinja,
    konobari,
    totalKuhinjaMl: sumMl(kuhinja),
    totalKonobariMl: sumMl(konobari),
    totalMl: sumMl(perDrink),
    count: inMonth.length,
  };
}
