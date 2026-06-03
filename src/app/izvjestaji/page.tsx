"use client";

import { useMemo, useState } from "react";
import { Download, FileDown, Upload } from "lucide-react";
import { useEntries } from "@/hooks/useEntries";
import { buildMonthReport, type DrinkTotal } from "@/lib/aggregate";
import { currentMonth, formatQty, monthLabel } from "@/lib/format";
import { downloadMonthPdf } from "@/lib/pdf";
import { exportJson, importJson } from "@/lib/backup";
import { MonthPicker } from "@/components/MonthPicker";
import { ReportTable } from "@/components/ReportTable";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/Toast";

const sumCount = (rows: DrinkTotal[]) => rows.reduce((s, r) => s + r.count, 0);

function TotalRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        strong ? "border-t border-line pt-2.5 mt-1" : ""
      }`}
    >
      <span
        className={
          strong ? "text-base font-bold text-ink" : "text-sm text-muted"
        }
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong ? "text-base font-bold text-accent" : "text-sm font-semibold text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function IzvjestajiPage() {
  const { entries, hydrated } = useEntries();
  const { show } = useToast();
  const [month, setMonth] = useState(currentMonth());
  const [busy, setBusy] = useState(false);

  const report = useMemo(
    () => buildMonthReport(entries, month),
    [entries, month],
  );

  const handlePdf = async () => {
    if (report.count === 0 || busy) return;
    setBusy(true);
    try {
      await downloadMonthPdf(report);
    } catch {
      show("Greška pri izradi PDF-a.", "error");
    }
    setBusy(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const n = await importJson(file);
      show(`Uvezeno ${n} zapisa ✓`);
    } catch (err) {
      show(err instanceof Error ? err.message : "Greška pri uvozu.", "error");
    }
    e.target.value = "";
  };

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-ink">Izvještaji</h1>
        <p className="text-sm text-muted">Mjesečni pregled potrošnje.</p>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <MonthPicker value={month} onChange={setMonth} max={currentMonth()} />
        <button
          type="button"
          onClick={handlePdf}
          disabled={report.count === 0 || busy}
          className="ml-auto inline-flex min-h-12 select-none items-center gap-2 rounded-xl bg-accent px-4 font-bold text-black transition active:scale-95 disabled:opacity-50"
        >
          <FileDown size={20} />
          {busy ? "Izrada…" : "Preuzmi PDF"}
        </button>
      </div>

      {!hydrated ? (
        <p className="py-10 text-center text-sm text-muted">Učitavanje…</p>
      ) : report.count === 0 ? (
        <EmptyState
          title={`Nema unosa za ${monthLabel(month)}`}
          hint="Odaberi drugi mjesec ili dodaj unose."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <ReportTable
            title="Ukupno — sva potrošnja"
            rows={report.perDrink}
            totalCount={report.count}
            totalMl={report.totalMl}
          />
          <ReportTable
            title="Kuhinja"
            rows={report.kuhinja}
            totalCount={sumCount(report.kuhinja)}
            totalMl={report.totalKuhinjaMl}
          />
          <ReportTable
            title="Konobari"
            rows={report.konobari}
            totalCount={sumCount(report.konobari)}
            totalMl={report.totalKonobariMl}
          />
          <ReportTable
            title="Lana"
            rows={report.lana}
            totalCount={sumCount(report.lana)}
            totalMl={report.totalLanaMl}
          />
          <ReportTable
            title="Dražen"
            rows={report.drazen}
            totalCount={sumCount(report.drazen)}
            totalMl={report.totalDrazenMl}
          />

          <div className="rounded-2xl border border-line bg-surface p-4">
            <TotalRow
              label="Ukupno Kuhinja"
              value={formatQty(sumCount(report.kuhinja), report.totalKuhinjaMl)}
            />
            <TotalRow
              label="Ukupno Konobari"
              value={formatQty(sumCount(report.konobari), report.totalKonobariMl)}
            />
            <TotalRow
              label="Ukupno Lana"
              value={formatQty(sumCount(report.lana), report.totalLanaMl)}
            />
            <TotalRow
              label="Ukupno Dražen"
              value={formatQty(sumCount(report.drazen), report.totalDrazenMl)}
            />
            <TotalRow
              label="UKUPNO SVE"
              value={formatQty(report.count, report.totalMl)}
              strong
            />
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-line pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Sigurnosna kopija
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex min-h-11 select-none items-center gap-2 rounded-xl bg-surface-2 px-4 text-sm font-semibold text-ink ring-1 ring-line transition active:scale-95"
          >
            <Download size={18} /> Izvezi podatke
          </button>
          <label className="inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-xl bg-surface-2 px-4 text-sm font-semibold text-ink ring-1 ring-line transition active:scale-95">
            <Upload size={18} /> Uvezi podatke
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
