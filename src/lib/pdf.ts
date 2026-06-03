import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { DrinkTotal, MonthReport } from "@/lib/aggregate";
import { formatQty, monthLabel } from "@/lib/format";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const FONT = "DejaVuSans";

const sumCount = (rows: DrinkTotal[]) => rows.reduce((s, r) => s + r.count, 0);

let fontPromise: Promise<string | null> | null = null;

function arrayBufferToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Fetch + base64-encode the Unicode font once (so č/ć/ž/š/đ render correctly). */
function loadFontBase64(): Promise<string | null> {
  if (!fontPromise) {
    fontPromise = fetch(`${basePath}/fonts/DejaVuSans.ttf`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("font"))))
      .then(arrayBufferToBase64)
      .catch(() => null);
  }
  return fontPromise;
}

function finalY(doc: jsPDF): number {
  return (
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 0
  );
}

export async function downloadMonthPdf(report: MonthReport): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // Embed the Unicode font; fall back to the built-in font if unavailable.
  let font = "helvetica";
  const b64 = await loadFontBase64();
  if (b64) {
    doc.addFileToVFS("DejaVuSans.ttf", b64);
    doc.addFont("DejaVuSans.ttf", FONT, "normal");
    font = FONT;
  }
  doc.setFont(font, "normal");

  const marginX = 40;
  doc.setFontSize(16);
  doc.text(`Izvještaj potrošnje — ${monthLabel(report.month)}`, marginX, 50);

  let y = 80;
  const section = (title: string, rows: DrinkTotal[]) => {
    doc.setFont(font, "normal");
    doc.setFontSize(12);
    doc.text(title, marginX, y);
    autoTable(doc, {
      startY: y + 10,
      head: [["Piće", "Količina"]],
      body: rows.length
        ? rows.map((r) => [r.name, formatQty(r.count, r.ml)])
        : [["Nema unosa", formatQty(0, 0)]],
      foot: [
        [
          "Ukupno",
          formatQty(
            sumCount(rows),
            rows.reduce((s, r) => s + r.ml, 0),
          ),
        ],
      ],
      theme: "grid",
      styles: { font, fontStyle: "normal", fontSize: 10, textColor: [25, 25, 25] },
      headStyles: {
        font,
        fontStyle: "normal",
        fillColor: [30, 38, 48],
        textColor: [255, 255, 255],
      },
      footStyles: {
        font,
        fontStyle: "normal",
        fillColor: [222, 228, 234],
        textColor: [20, 20, 20],
      },
      columnStyles: { 1: { halign: "right", cellWidth: 130 } },
      margin: { left: marginX, right: marginX },
    });
    y = finalY(doc) + 28;
  };

  section("Ukupno — sva potrošnja", report.perDrink);
  section("Kuhinja", report.kuhinja);
  section("Konobari", report.konobari);
  section("Lana", report.lana);
  section("Dražen", report.drazen);

  // Keep the totals block together on a page.
  const pageH = doc.internal.pageSize.getHeight();
  if (y + 100 > pageH) {
    doc.addPage();
    y = 50;
  }

  doc.setFont(font, "normal");
  doc.setFontSize(12);
  doc.text(
    `Ukupno Kuhinja:  ${formatQty(sumCount(report.kuhinja), report.totalKuhinjaMl)}`,
    marginX,
    y,
  );
  y += 18;
  doc.text(
    `Ukupno Konobari:  ${formatQty(sumCount(report.konobari), report.totalKonobariMl)}`,
    marginX,
    y,
  );
  y += 18;
  doc.text(
    `Ukupno Lana:  ${formatQty(sumCount(report.lana), report.totalLanaMl)}`,
    marginX,
    y,
  );
  y += 18;
  doc.text(
    `Ukupno Dražen:  ${formatQty(sumCount(report.drazen), report.totalDrazenMl)}`,
    marginX,
    y,
  );
  y += 18;
  doc.setFontSize(13);
  doc.text(`UKUPNO SVE:  ${formatQty(report.count, report.totalMl)}`, marginX, y);

  doc.save(`izvjestaj-${report.month}.pdf`);
}
