import type { Entry } from "@/types";
import { DRINKS } from "@/constants/drinks";

export interface DrinkTotal {
  drinkId: string;
  name: string;
  ml: number;
  count: number; // number of entries (units) for this drink
}

export interface MonthReport {
  month: string;
  perDrink: DrinkTotal[]; // total per drink (all consumers)
  kuhinja: DrinkTotal[]; // total per drink — kitchen only
  konobari: DrinkTotal[]; // total per drink — waiters only
  lana: DrinkTotal[]; // total per drink — Lana only
  drazen: DrinkTotal[]; // total per drink — Dražen only
  totalKuhinjaMl: number;
  totalKonobariMl: number;
  totalLanaMl: number;
  totalDrazenMl: number;
  totalMl: number;
  count: number; // number of entries in the month
}

/** Sum ml + entry count per drink, in canonical DRINKS order, only drinks used. */
function sumByDrink(rows: Entry[]): DrinkTotal[] {
  const ml = new Map<string, number>();
  const count = new Map<string, number>();
  for (const e of rows) {
    ml.set(e.drinkId, (ml.get(e.drinkId) ?? 0) + e.ml);
    count.set(e.drinkId, (count.get(e.drinkId) ?? 0) + 1);
  }
  return DRINKS.filter((d) => count.has(d.id)).map((d) => ({
    drinkId: d.id,
    name: d.name,
    ml: ml.get(d.id) ?? 0,
    count: count.get(d.id) ?? 0,
  }));
}

const sumMl = (rows: DrinkTotal[]) => rows.reduce((s, r) => s + r.ml, 0);

export function buildMonthReport(entries: Entry[], month: string): MonthReport {
  const inMonth = entries.filter((e) => e.month === month);
  const kuhinja = sumByDrink(inMonth.filter((e) => e.consumer === "kuhinja"));
  const konobari = sumByDrink(inMonth.filter((e) => e.consumer === "konobari"));
  const lana = sumByDrink(inMonth.filter((e) => e.consumer === "lana"));
  const drazen = sumByDrink(inMonth.filter((e) => e.consumer === "drazen"));
  const perDrink = sumByDrink(inMonth);

  return {
    month,
    perDrink,
    kuhinja,
    konobari,
    lana,
    drazen,
    totalKuhinjaMl: sumMl(kuhinja),
    totalKonobariMl: sumMl(konobari),
    totalLanaMl: sumMl(lana),
    totalDrazenMl: sumMl(drazen),
    totalMl: sumMl(perDrink),
    count: inMonth.length,
  };
}
