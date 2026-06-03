"use client";

import { useEffect, useState } from "react";
import type { Entry } from "@/types";
import { CHANGE_EVENT, storage } from "@/lib/storage";

/**
 * Live, newest-first list of entries backed by localStorage.
 *
 * Hydration-safe: initial state is an empty array (matching the static-export
 * HTML), the real data loads in the mount effect, and the list re-reads on
 * every `potrosnja:changed` (same tab) and `storage` (other tabs) event.
 */
export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => setEntries(storage.getAll());
    refresh();
    setHydrated(true);
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return {
    entries,
    hydrated,
    add: storage.add,
    update: storage.update,
    remove: storage.remove,
  };
}
