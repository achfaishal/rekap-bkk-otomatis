# Rekap BKK Otomatis

Preview aplikasi internal Finance untuk digitalisasi Bukti Kas Keluar, verifikasi manusia, monitoring, financial control, spending intelligence, dan audit trail.

## Status

Implementasi saat ini adalah **Phase 1 preview lokal — DEMO DATA CONTOH**. UI dan domain demo dapat dijalankan, tetapi belum production-ready. Data contoh sintetis disimpan di `localStorage`; upload file nyata dicatat dengan status provider belum tersedia dan tidak menghasilkan BKK finansial palsu.

- Level 1: partial — upload state, multi-candidate fixture, source/candidate review, correction, dan human verification tersedia dalam demo.
- Level 2: partial — KPI, tren, kategori, recipient, filter, dan drill-down membaca canonical demo dataset yang sama.
- Level 3: partial — exception queue, evidence, manual resolution, audit, dan period-lock guard demo tersedia.
- Level 4: partial — recipient/category/concentration/spike/recurring states tersedia; forecast memberi insufficient-data state.
- Level 5: partial — identity dan eligibility contract dipakai bersama dalam preview.
- Level 6: **PROPOSED / OPEN** — belum LOCKED. D1/R2/Queue/Access/OCR dan atomic platform proofs belum diimplementasikan.

## Menjalankan lokal

Prasyarat: Node.js LTS yang didukung dan npm.

```bash
npm install
npm run dev
```

Buka `http://localhost:4173`.

## Verifikasi

```bash
npm run typecheck
npm test
npm run build
```

## Batasan keamanan dan data

- Jangan gunakan data Finance nyata pada preview ini.
- Tidak ada credential, authentication produksi, atau koneksi Cloudflare.
- Browser belum menjadi boundary otoritatif; mutation demo lokal tidak boleh dipakai sebagai kontrol finansial produksi.
- Currency/scale, lifecycle eligibility final, nomor BKK scope, role matrix, period override, OCR provider, retention, RPO/RTO, dan threshold masih OPEN.
- Parser/OCR tidak dikonfigurasi. Upload nyata mendapat state jujur `PROVIDER_UNAVAILABLE`.

Lihat [status implementasi](docs/IMPLEMENTATION_STATUS.md), [open decisions](docs/OPEN_DECISIONS.md), dan [contract decision record](docs/CONTRACT_DECISION_RECORD.md).
