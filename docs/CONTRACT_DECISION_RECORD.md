# Contract Decision Record

Status: **PENDING BUSINESS APPROVAL**  
Prepared: 1 October 2026, Asia/Bangkok

Dokumen ini menyediakan satu paket keputusan minimum sebelum schema, authorization, dan mutation persistence production dibangun. Isi di bawah adalah rekomendasi, bukan kontrak LOCKED sampai pengguna menyetujuinya secara eksplisit.

## CDR-001 — Lifecycle dan analytics eligibility

**Recommended contract**

- `EXTRACTED` dan `NEEDS_VERIFICATION` tidak masuk metrik finansial aktif.
- `VERIFIED` masuk monitoring dan intelligence sebagai transaksi yang sudah diperiksa manusia.
- `FINAL` masuk monitoring dan intelligence serta menandakan proses administrasi selesai.
- `FLAGGED` adalah control overlay, bukan pengganti lifecycle. Flag tidak otomatis mengeluarkan `VERIFIED`/`FINAL` dari analytics; UI wajib menampilkan finding terbuka.
- `CANCELLED` selalu tersimpan untuk audit tetapi keluar dari active financial metrics.
- Control engine tidak dapat mengubah lifecycle atau financial values secara otomatis.

**Reasoning:** mempertahankan human authority, mencegah data mentah mencemari metrik, dan menghindari angka dashboard berubah hanya karena detector membuat flag.

## CDR-002 — Monetary contract

**Recommended contract**

- Currency v1: `IDR` only.
- Canonical scale: `0` (rupiah penuh tanpa pecahan).
- Persistence/API amount: normalized signed integer string; nilai BKK wajib non-negative sesuai validation command.
- Arithmetic: `BigInt`; dilarang `parseFloat`, SQL `REAL`, atau konversi melalui JavaScript `number` untuk nilai uang.
- Average/percentage internal memakai exact numerator/denominator. Display average rupiah menggunakan half-up ke rupiah terdekat.
- Percentage ditampilkan dua angka desimal dengan half-up. Denominator nol menghasilkan `null/not applicable`, bukan 0%, Infinity, atau nilai rekaan.
- Semua import dengan pecahan rupiah ditolak dan memerlukan koreksi manusia, bukan silently rounded.

**Reasoning:** sesuai praktik nominal BKK IDR pada preview, menjaga exact round-trip, dan membuat aturan rounding eksplisit.

## CDR-003 — Permission matrix v1

Semua permission ditetapkan server-side dan deny-by-default. Cloudflare Access authentication tidak otomatis memberikan financial permission.

| Capability | Finance Admin | Verifikator | Controller | Auditor |
|---|---:|---:|---:|---:|
| Lihat dashboard/BKK/source | Yes | Yes | Yes | Yes |
| Upload dokumen | Yes | Yes | No | No |
| Koreksi candidate sebelum verify | Yes | Yes | No | No |
| Verify BKK | Yes | Yes | No | No |
| Finalize BKK | Yes | No | No | No |
| Koreksi BKK verified/final | Yes | No | No | No |
| Cancel BKK | Yes | No | No | No |
| Koreksi kategori | Yes | Yes | No | No |
| Resolve control finding | Yes | No | Yes | No |
| Lock period | Yes | No | Yes | No |
| Override period lock | **No role by default** | No | No | No |
| Lihat audit trail | Yes | Yes | Yes | Yes |
| Kelola user/role | **Out of scope v1** | No | No | No |

Tambahan guard:

- Actor diambil dari identity terverifikasi, tidak pernah dari request body.
- Pengguna tidak dapat menyetujui override lock miliknya sendiri karena override belum tersedia v1.
- Correction pada BKK `FINAL` memerlukan reason dan membuat revision + audit atomik.
- Role assignment dilakukan melalui operational administration terpisah sampai user-management contract disetujui.

**Reasoning:** separation of duties sederhana tanpa memberi broad admin rights atau mengarang mekanisme override.

## Masih OPEN setelah tiga kontrak ini

- Scope nomor BKK, reset, dan duplicate resolution policy.
- Identity/alias penerima dan category taxonomy resmi.
- Threshold control/intelligence dan forecast window.
- Cloudflare account/domain/plan dan Access audience.
- Parser/OCR provider serta data handling approval.
- Retention, upload limits, RPO/RTO, backup dan alert owner.

## Approval

Belum ada approval recorded. Approval harus menyebut menerima paket rekomendasi atau perubahan spesifik untuk CDR-001, CDR-002, dan CDR-003.
