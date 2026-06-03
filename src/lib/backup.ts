import type { Entry, QuantityId } from "@/types";
import { storage } from "@/lib/storage";
import { toLocalDay } from "@/lib/format";

const VALID_QTY: QuantityId[] = ["mala", "koktel", "velika", "boca"];

/** Download all entries as a JSON backup file. */
export function exportJson(): void {
  const payload = {
    app: "potrosnja",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: storage.getAll(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `potrosnja-backup-${toLocalDay(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Restore entries from a JSON backup. Returns the number of imported rows. */
export async function importJson(file: File): Promise<number> {
  const parsed = JSON.parse(await file.text());
  const rows: unknown[] = Array.isArray(parsed) ? parsed : parsed?.entries;
  if (!Array.isArray(rows)) {
    throw new Error("Neispravna datoteka (nedostaju zapisi).");
  }

  const entries = rows.filter((r): r is Entry => {
    const e = r as Partial<Entry>;
    return (
      typeof e?.id === "string" &&
      typeof e?.ts === "number" &&
      typeof e?.drinkId === "string" &&
      typeof e?.consumer === "string" &&
      VALID_QTY.includes(e?.quantityId as QuantityId)
    );
  });

  if (!entries.length) throw new Error("Datoteka ne sadrži ispravne zapise.");
  // Merge by id (imported wins) so a restore never deletes current entries.
  const byId = new Map(storage.getAll().map((e) => [e.id, e]));
  for (const e of entries) byId.set(e.id, e);
  storage.replaceAll([...byId.values()]);
  return entries.length;
}
