# Potrošnja

Jednostavna interna web-aplikacija za restoran — služi za brzu evidenciju pića
uzetih iz zaliha za **kuhinju** ili **konobare** koja nisu prodana kroz redovnu
prodaju. Cilj: zaposlenik evidentira uzeto piće za **manje od 5 sekundi**.

**Live (GitHub Pages):** https://luksi21.github.io/potrosnja/

## Funkcionalnosti

- **Unos** — mreža kartica s pićima; dodir otvara mali prozor za unos
  (vrsta potrošnje: Kuhinja/Konobari, količina, opcionalna napomena) → **Evidentiraj**.
  Razumne pretpostavljene vrijednosti znače 2 dodira za tipičan unos.
- **Istorija** — pregled svih unosa uz pretragu, ispravku i brisanje zapisa.
- **Izvještaji** — odabir mjeseca, ukupna potrošnja po piću te posebno za
  Kuhinju i Konobare, ukupni zbrojevi, te **Preuzmi PDF**.
- **Sigurnosna kopija** — izvoz/uvoz svih podataka kao JSON.
- Tamna tema, mobile-first, velika dugmad, radi offline (podaci se čuvaju na uređaju).

## Tehnologije

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Podaci u pregledniku (`localStorage`) — bez servera i baze
- PDF: `jspdf` + `jspdf-autotable` (s ugrađenim Unicode fontom za hrvatske znakove)
- Statički izvoz (`output: 'export'`), instalabilno kao PWA

## Pokretanje lokalno

```bash
npm install
npm run dev          # http://localhost:3000
```

Produkcijski statički izvoz:

```bash
npm run build        # generira ./out
npx serve out        # posluži lokalno
```

## Deploy

Push na granu `main` automatski pokreće GitHub Actions
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) koji gradi
statički izvoz i objavljuje ga na GitHub Pages. Stranica je projektna pa se
servira sa pod-putanje `/potrosnja` (postavljeno preko `NEXT_PUBLIC_BASE_PATH`).

## Napomena o podacima

Podaci se spremaju **lokalno u pregledniku uređaja** i ne sinkroniziraju se
između uređaja. Za prijenos ili sigurnosnu kopiju koristi Izvezi/Uvezi u
Izvještajima.
