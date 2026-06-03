import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { DrinkTotal, MonthReport } from "@/lib/aggregate";
import { formatLiters, monthLabel } from "@/lib/format";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const FONT = "DejaVuSans";

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
  const section = (title: string, rows: DrinkTotal[], totalMl: number) => {
    doc.setFont(font, "normal");
    doc.setFontSize(12);
    doc.text(title, marginX, y);
    autoTable(doc, {
      startY: y + 10,
      head: [["Piće", "Količina"]],
      body: rows.length
        ? rows.map((r) => [r.name, formatLiters(r.ml)])
        : [["Nema unosa", formatLiters(0)]],
      foot: [["Ukupno", formatLiters(totalMl)]],
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

  section("Ukupno — sva potrošnja", report.perDrink, report.totalMl);
  section("Kuhinja", report.kuhinja, report.totalKuhinjaMl);
  section("Konobari", report.konobari, report.totalKonobariMl);

  doc.setFont(font, "normal");
  doc.setFontSize(12);
  doc.text(`Ukupno Kuhinja:  ${formatLiters(report.totalKuhinjaMl)}`, marginX, y);
  y += 18;
  doc.text(`Ukupno Konobari:  ${formatLiters(report.totalKonobariMl)}`, marginX, y);
  y += 18;
  doc.setFontSize(13);
  doc.text(`UKUPNO SVE:  ${formatLiters(report.totalMl)}`, marginX, y);

  doc.save(`izvjestaj-${report.month}.pdf`);
}
