import type { Consumer } from "@/types";

export const CONSUMERS: { id: Consumer; label: string }[] = [
  { id: "kuhinja", label: "Kuhinja" },
  { id: "konobari", label: "Konobari" },
];

export const CONSUMER_LABEL: Record<Consumer, string> = {
  kuhinja: "Kuhinja",
  konobari: "Konobari",
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
