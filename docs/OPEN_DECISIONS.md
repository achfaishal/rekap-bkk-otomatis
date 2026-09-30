# Open Decisions

Dokumen ini tidak mengubah Level 1–5 yang berstatus LOCKED dan tidak menganggap Level 6 sudah disetujui.

| ID | Keputusan yang dibutuhkan | Dampak | Treatment preview |
|---|---|---|---|
| IF-001 | VERIFIED vs FINAL eligibility dan FLAGGED interaction | Semua metrik dan lifecycle | Configurable demo contract memakai VERIFIED + FINAL; diberi label demo |
| IF-002 | Scope uniqueness/sequence nomor BKK dan reset | Constraints dan sequence finding | Tidak ada global unique; gap rule berlabel demo |
| IF-003 | Definisi periode, lock/override role, koreksi lintas periode | Mutation guard | Period-lock lokal untuk demonstrasi, tanpa broad override |
| IF-004 | Currency, scale, rounding, display precision | Schema dan arithmetic | Amount disimpan sebagai integer string; UI demo menampilkan IDR scale 0 |
| IF-005 | Recipient identity/alias dan taxonomy kategori | Analytics | Tidak ada fuzzy merge; exact recipient string only |
| IF-006 | Finance permission matrix, Access/domain/account | Authorization | Tidak ada auth produksi; demo actor eksplisit |
| IF-007 | Native parser dan OCR provider/data handling | Extraction | Upload nyata tetap provider unavailable |
| IF-008 | Upload limits, retention, RPO/RTO, backup/alert owner | Operations | Tidak ada klaim SLA atau retention |

## Rekomendasi keputusan berikutnya

Setujui atau revisi core ADR Level 6 serta kontrak IF-001 sampai IF-004 sebelum final schema dan server mutation layer dibangun. Vendor OCR dapat tetap OPEN sampai benchmark representatif selesai.
