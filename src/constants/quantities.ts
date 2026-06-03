import type { QuantityId, QuantityOption } from "@/types";

/** Fixed quantity options (volumes), identical for every drink. */
export const QUANTITIES: QuantityOption[] = [
  { id: "mala", label: "Mala čaša (100 ml)", short: "100 ml", ml: 100 },
  { id: "koktel", label: "Koktel čaša (300 ml)", short: "300 ml", ml: 300 },
  { id: "velika", label: "Velika čaša (500 ml)", short: "500 ml", ml: 500 },
  { id: "boca", label: "Boca 1 litar", short: "1 L", ml: 1000 },
];

export const QTY_BY_ID: Record<QuantityId, QuantityOption> = Object.fromEntries(
  QUANTITIES.map((q) => [q.id, q]),
) as Record<QuantityId, QuantityOption>;

/** Sensible default that minimises taps on the fast-entry path. */
export const DEFAULT_QUANTITY: QuantityId = "koktel";
