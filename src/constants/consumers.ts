import type { Consumer } from "@/types";

export const CONSUMERS: { id: Consumer; label: string }[] = [
  { id: "kuhinja", label: "Kuhinja" },
  { id: "konobari", label: "Konobari" },
  { id: "lana", label: "Lana" },
  { id: "drazen", label: "Dražen" },
];

export const CONSUMER_LABEL: Record<Consumer, string> = {
  kuhinja: "Kuhinja",
  konobari: "Konobari",
  lana: "Lana",
  drazen: "Dražen",
};

/** Default consumer for the fast-entry path (kitchen is the most common). */
export const DEFAULT_CONSUMER: Consumer = "kuhinja";

/** Quick-fill suggestions for the optional Napomena field. */
export const NOTE_SUGGESTIONS = [
  "Sos",
  "Rižoto",
  "Degustacija",
  "Osoblje",
  "Ostalo",
];
