// Generates an importable backup file for the May 2026 consumption log.
// Output: public/data/svibanj-2026.json — load it in the app via "Uvezi podatke".
// Run: node scripts/seed-svibanj-2026.mjs
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";

const YEAR = 2026;
const MONTH = 5; // May

// Raw daily log: [dayOfMonth, drinkNameAsLogged, units, sourceAsLogged]
const RAW = [
  [4, "Coca Cola", 1, "Kuhinja"],
  [4, "Cola", 1, "Konobari"],
  [4, "Cappuccino", 1, "Lana"],

  [5, "Sok od narandze", 1, "Dražen"],
  [5, "Cola", 1, "Konobari"],
  [5, "Espresso", 1, "Nemanja"],
  [5, "Cola", 1, "Konobari"],
  [5, "Cappuccino", 1, "Lana"],
  [5, "Aqua Panna", 2, "Lana"],

  [7, "Sprite", 2, "Kuhinja"],
  [7, "Tonic", 1, "Kuhinja"],
  [7, "Cola", 1, "Konobari"],
  [7, "Cappuccino", 1, "Lana"],
  [7, "Aqua Panna", 2, "Lana"],
  [7, "Sok od narandze", 1, "Lana"],

  [8, "Cappuccino", 1, "Lana"],
  [8, "Sok od narandze", 1, "Lana"],
  [8, "Cola", 1, "Kuhinja"],
  [8, "Sprite", 3, "Kuhinja"],

  [9, "Cappuccino", 1, "Lana"],
  [9, "Sok od narandze", 1, "Lana"],
  [9, "Sok od jabuke", 1, "Lana"],
  [9, "Cola", 1, "Konobari"],
  [9, "Sprite", 1, "Kuhinja"],

  [10, "Kola zero", 1, "Konobari"],
  [10, "Kola", 2, "Konobari"],
  [10, "Sprite", 1, "Kuhinja"],
  [10, "Tonic", 1, "Kuhinja"],
  [10, "Sprite", 2, "Konobari"],
  [10, "Sprite", 2, "Konobari"],

  [14, "Sprite", 2, "Konobari"],
  [14, "Cola", 2, "Konobari"],
  [14, "Tonic", 2, "Kuhinja"],
  [14, "Fanta", 1, "Konobari"],
  [14, "Jamnica", 1, "Kuhinja"],

  [15, "Tonic", 1, "Kuhinja"],
  [15, "Kola", 1, "Kuhinja"],
  [15, "Sprite", 1, "Konobari"],
  [15, "Fanta", 1, "Konobari"],
  [15, "Kola", 1, "Konobari"],
  [15, "Kola", 1, "Kuhinja"],

  [17, "Tonic", 1, "Kuhinja"],
  [17, "Sprite", 2, "Kuhinja"],
  [17, "Sprite", 1, "Konobari"],

  [21, "Sprite", 2, "Kuhinja"],
  [21, "Kola", 1, "Konobari"],

  [23, "Kola", 1, "Kuhinja"],
  [23, "Kola", 1, "Konobari"],
  [23, "Tonic", 1, "Kuhinja"],
  [23, "Sprite", 1, "Kuhinja"],

  [24, "Kola", 2, "Kuhinja"],
  [24, "Kola", 2, "Konobari"],
  [24, "Fanta", 1, "Konobari"],
  [24, "Sprite", 2, "Kuhinja"],

  [25, "Tonic", 1, "Kuhinja"],
  [25, "Jamnica", 1, "Kuhinja"],
  [25, "Kola", 2, "Kuhinja"],
  [25, "Sprite", 2, "Kuhinja"],

  [26, "Kola", 3, "Kuhinja"],
  [26, "Sprite", 1, "Kuhinja"],
  [26, "Fanta", 1, "Konobari"],

  [27, "Kola", 1, "Konobari"],
  [27, "Tonic", 1, "Kuhinja"],

  [28, "Sprite", 1, "Konobari"],
  [28, "Sprite", 2, "Kuhinja"],
  [28, "Kola", 2, "Konobari"],
  [28, "Kola", 1, "Kuhinja"],
  [28, "Kola Zero", 1, "Konobari"],
  [28, "Schweppes Bitter", 1, "Kuhinja"],

  [29, "Sprite", 2, "Kuhinja"],
  [29, "Coca Cola", 1, "Kuhinja"],
  [29, "Tonic Schweppes", 1, "Kuhinja"],

  [30, "Sprite", 1, "Kuhinja"],
  [30, "Cola Zero", 1, "Konobari"],
  [30, "Cola", 1, "Kuhinja"],
];

// Drink normalization → existing/added drink ids (+ optional note for juices).
const DRINK_MAP = {
  "coca cola": { id: "coca-cola" },
  cola: { id: "coca-cola" },
  kola: { id: "coca-cola" },
  "cola zero": { id: "coca-cola-zero" },
  "kola zero": { id: "coca-cola-zero" },
  sprite: { id: "sprite" },
  fanta: { id: "fanta" },
  jamnica: { id: "jamnica" },
  tonic: { id: "tonic" },
  "tonic schweppes": { id: "tonic-schweppes" },
  "schweppes bitter": { id: "schweppes-bitter" },
  cappuccino: { id: "cappuccino" },
  espresso: { id: "espresso" },
  "sok od narandze": { id: "vocni-sokovi", note: "Narandža" },
  "sok od jabuke": { id: "vocni-sokovi", note: "Jabuka" },
  "aqua panna": { id: "aqua-panna-velika" }, // size not specified → large
};

// Source normalization → consumer ids. Nemanja → Konobari (per decision).
const CONSUMER_MAP = {
  kuhinja: "kuhinja",
  konobari: "konobari",
  lana: "lana",
  dražen: "drazen",
  nemanja: "konobari",
};

const pad2 = (n) => String(n).padStart(2, "0");
const monthStr = `${YEAR}-${pad2(MONTH)}`;

const entries = [];
let prevDay = null;
let seq = 0;

for (const [day, drinkRaw, units, sourceRaw] of RAW) {
  const drink = DRINK_MAP[drinkRaw.toLowerCase()];
  const consumer = CONSUMER_MAP[sourceRaw.toLowerCase()];
  if (!drink) throw new Error(`Unmapped drink: ${drinkRaw}`);
  if (!consumer) throw new Error(`Unmapped source: ${sourceRaw}`);

  if (day !== prevDay) {
    seq = 0;
    prevDay = day;
  }
  for (let u = 0; u < units; u++) {
    // noon + a minute per unit so same-day entries keep their order and ts differ
    const ts = new Date(YEAR, MONTH - 1, day, 12, 0, seq).getTime();
    seq += 1;
    entries.push({
      id: randomUUID(),
      ts,
      day: `${YEAR}-${pad2(MONTH)}-${pad2(day)}`,
      month: monthStr,
      drinkId: drink.id,
      quantityId: "komad",
      ml: 0,
      consumer,
      note: drink.note ?? "",
    });
  }
}

const payload = {
  app: "potrosnja",
  version: 1,
  exportedAt: new Date().toISOString(),
  entries,
};

mkdirSync("public/data", { recursive: true });
writeFileSync(
  "public/data/svibanj-2026.json",
  JSON.stringify(payload, null, 2),
  "utf8",
);

// ---- verification summary ----
const byConsumer = {};
const byDrink = {};
for (const e of entries) {
  byConsumer[e.consumer] = (byConsumer[e.consumer] ?? 0) + 1;
  byDrink[e.drinkId] = (byDrink[e.drinkId] ?? 0) + 1;
}
console.log(`Total units (entries): ${entries.length}`);
console.log("By source:", byConsumer);
console.log("By drink:", byDrink);
