# Implementation Status

Tanggal: 30 September 2026  
Baseline: GREENFIELD; folder awal hanya memuat dua dokumen requirement dan tidak memiliki Git metadata lokal.

## Yang sudah dibuat

- React + Vite + TypeScript strict foundation.
- Navigasi lengkap untuk Dashboard, Upload, Verifikasi, Daftar BKK, Financial Control, Spending Intelligence, Audit Trail, dan Period Lock.
- Satu in-memory/localStorage canonical demo dataset yang dipakai bersama seluruh modul.
- Exact-money domain helper berbasis `BigInt` dan amount string.
- Shared demo eligibility contract: hanya `VERIFIED` dan `FINAL` masuk active metrics; `CANCELLED` dan unverified tidak masuk.
- Human correction/verification flow dengan source mapping, warnings, revision increment, finding resolution, dan append-oriented demo audit.
- Upload attempt nyata mendapat `PROVIDER_UNAVAILABLE`; tidak membuat extraction fixture atau financial record palsu.
- Manual control resolution, period lock demo guard, recipient/category intelligence, concentration, dan honest insufficient-data forecast.
- Responsive desktop/mobile layout, loading-independent empty states, filters, drill-down drawer, dan status badges.
- Domain unit tests dan GitHub Actions CI.

## Belum diimplementasikan

- Cloudflare Worker authoritative API, D1 persistence/migrations, R2 private object storage, Queue/outbox/reconciliation.
- Cloudflare Access JWT verification dan approved finance permission matrix.
- Native PDF parser/OCR adapter serta private representative benchmark.
- Atomic D1 CAS/period-lock/revision/audit proof dan staging race tests.
- Real source preview/download authorization and malicious-file validation.
- Playwright and actual Workers/D1 integration tests.
- Backup/export/source-copy automation, restore drill, alerts, staging, dan deployment.

Status ini sengaja membedakan preview fungsional dari production readiness.
