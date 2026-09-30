# MASTER BUILD PROMPT — REKAP BKK OTOMATIS

## ROOM: 07 — CODEX BUILD & EXECUTION

Kamu berperan sebagai Senior Full-Stack Engineer, System Analyst, Finance System Designer, Data Architect, Security Reviewer, dan QA Engineer.

Tugasmu adalah **membangun website Rekap BKK Otomatis yang berfungsi end-to-end** dari requirement Level 1–6 di bawah. Kerjakan implementasi di room Codex ini. Jangan berhenti pada proposal, diagram, landing page, atau dashboard dengan data dummy saja.

Repository: https://github.com/achfaishal/rekap-bkk-otomatis

Bahasa produk: Bahasa Indonesia. Target pengguna: internal Finance. Pengguna memerlukan alat untuk digitalisasi Bukti Kas Keluar, verifikasi manusia, rekap, monitoring, financial control, dan spending intelligence.

## 1. STATUS DAN SUMBER KEBENARAN

- Level 1 — Digitalisasi BKK: LOCKED.
- Level 2 — Monitoring: LOCKED.
- Level 3 — Financial Control: LOCKED.
- Level 4 — Spending Intelligence: LOCKED.
- Level 5 — Integration: LOCKED.
- Level 6 — Technology & System Architecture: Technical Architecture v1 tersedia dengan status **PROPOSED / OPEN**, belum LOCKED.

Dokumen pendamping, jika dilampirkan: **Level-6-Technical-Architecture-v1-PROPOSED.md**. Baca seluruh dokumen sebelum implementasi arsitektur. Ringkasan pentingnya juga diberikan dalam prompt ini agar pekerjaan bisa dimulai.

Prompt ini mengizinkan pembangunan foundation dan preview yang dapat direview dengan architecture proposal tersebut. **Prompt ini tidak otomatis mengubah status Level 6 menjadi LOCKED**, memilih vendor OCR, menetapkan finance role matrix, atau memutuskan business open items.

Sebelum menetapkan schema/permission policy yang bergantung keputusan bisnis, atau mengaktifkan real-data production, ambil keputusan eksplisit untuk item yang benar-benar memblokir. Tetap lanjutkan UI, scaffolding, provider interfaces, tests, dan pekerjaan lain yang tidak bergantung keputusan itu. Bedakan prototype policy/synthetic fixtures dari approved financial policy.

Jika dokumen locked lain tersedia, baca dan pertahankan detailnya. Jika ada konflik, catat Integration Finding dan minta keputusan yang spesifik; jangan memilih business rule baru secara diam-diam. Repository menentukan fakta implementasi existing; requirement locked menentukan perilaku yang harus dibangun.

## 2. FIRST ACTION — AUDIT REPOSITORY AKTUAL

Audit seluruh repo sebelum coding: AGENTS.md/instruksi lokal, branch/commit, semua source/config, manifest/lockfile, framework/runtime, schema/migrations, storage/extraction, auth/permissions, tests, CI dan deployment.

Audit sebelumnya pada 30 September 2026: branch main, commit 1d0cc5cb8685f6a5ba7a9bf58517d8e8d5fef1eb, hanya README.md. Visibility saat itu public. **Verifikasi ulang**, jangan menganggap repo masih sama.

Jika tetap README-only, catat baseline GREENFIELD. Jika sudah ada implementasi sehat, preserve before replace. Jangan menimpa user changes atau meminjam stack/role/business rules dari BKM Otomatis atau Pantau Piutang.

Berikan audit ringkas dan execution plan, kemudian lanjutkan bagian yang sudah dapat dikerjakan. Buat branch kerja untuk perubahan jika workflow repo mengizinkan; jangan force-push, menghapus history, atau mengubah main/visibility tanpa scope/izin yang sesuai.

## 3. PRODUK YANG HARUS DIBANGUN

Website aplikasi internal dengan navigation yang jelas:

1. Dashboard.
2. Upload Dokumen.
3. Antrean Verifikasi.
4. Daftar BKK.
5. Detail BKK & Source Document.
6. Financial Control / Exception Queue.
7. Spending Intelligence.
8. Audit Trail.
9. Period Lock / settings sesuai approved permissions.

Ini adalah satu aplikasi dengan data shared, bukan halaman terpisah yang masing-masing memiliki dataset sendiri. Layout boleh menyesuaikan implementasi tanpa menghapus scope.

Desain profesional, tenang, mudah dibaca dan dipakai Finance. Prioritaskan desktop, tetap usable di layar kecil. Gunakan label Indonesia, date/amount formatting Indonesia, status yang jelas, readable tables, filter, pagination, drill-down, serta loading/empty/error/success states. Jangan mengisi production empty states dengan angka rekaan.

## 4. LEVEL 1 — DIGITALISASI BKK [LOCKED]

Flow: PDF/Image → Upload → Extraction → Candidate Data → Admin Verification/Correction → Finalisasi sesuai lifecycle → Structured BKK Database.

Field minimum:

- No BKK.
- Tanggal BKK.
- Dibayar Kepada.
- Keterangan.
- Total.
- Source document reference; page/region ketika dapat diidentifikasi.
- Status/lifecycle dan Kategori Pengeluaran untuk integrasi level berikutnya.

Satu file dapat berisi beberapa BKK; setiap BKK menjadi transaction record terpisah dengan canonical identity. Jangan menyamakan satu file atau satu halaman dengan satu BKK. Pertahankan keterlacakan semua candidate ke dokumen asal.

Admin dapat melihat source berdampingan dengan hasil extraction, mengoreksi field, melihat warnings, dan melakukan verification/finalization. Extraction/OCR bukan financial authority dan tidak boleh auto-finalize. Re-extraction tidak boleh menimpa financial values yang telah diverifikasi tanpa human command.

Tampilkan upload/extraction status dan diagnostic yang berguna; error tidak menghasilkan financial record sukses palsu. Duplicate file, duplicate BKK dan candidate ambigu harus ditangani secara berbeda. Original source tidak berubah karena correction.

## 5. LEVEL 2 — MONITORING [LOCKED]

Monitoring hanya menggunakan trusted BKK VERIFIED/FINAL sesuai lifecycle resmi; draft, raw, unverified dan cancelled tidak mencemari active financial metrics. Periode reporting menggunakan **Tanggal BKK**, bukan tanggal upload.

Bangun:

- KPI Jumlah BKK, Total Kas Keluar, Average per BKK, Largest BKK dan perubahan MoM.
- Cash-Out Trend per bulan.
- Top Recipients dengan drill-down ke underlying BKK.
- Spend by Category: jumlah, total dan share.
- Largest Transactions; bedakan terbesar per BKK dari terbesar per category.
- Monthly comparison: selected month vs immediately previous month; count, total, average, absolute dan percentage variance.
- Detail table: search, month/year, recipient, category, amount range, sort, source/detail access.
- Exception monitoring berbasis rules/calculation untuk nominal besar, recipient spikes dan perubahan cash-out.

Kategori dapat dikoreksi admin sesuai approved permissions. Jangan mengunci threshold, category taxonomy atau payee alias auto-merge yang belum disepakati. Saat denominator nol atau historical data tidak cukup, berikan hasil/pesan eksplisit; jangan menampilkan Infinity atau persentase rekaan.

Semua widgets memakai eligibility dan calculation contracts yang sama. Basic monitoring tetap bekerja tanpa AI.

## 6. LEVEL 3 — FINANCIAL CONTROL [LOCKED]

Flow: Detection → Flag → Explain → Exception Queue → Human Resolution → Audit Trail.

Implementasikan duplicate BKK, potential duplicate, missing/jumping BKK number, total mismatch, unverified BKK, cancelled BKK, period lock, exception resolution dan append-oriented business audit.

Lifecycle baseline: EXTRACTED → NEEDS_VERIFICATION → VERIFIED → FINAL, dengan FLAGGED/CANCELLED sebagai special states menurut kontrak resmi. Jangan menebak apakah flag memengaruhi eligibility atau verification secara otomatis.

Setiap finding menyediakan jenis/severity sesuai rule, penjelasan, evidence/source/BKK link, rule version dan manual resolution history. Missing number dapat menjadi finding tanpa existing BKK. Scope sequence/reset tahun/cabang/jenis harus berasal dari approved contract.

Total mismatch menggunakan evidence komponen/rincian yang tersedia dan rule resmi. Jika source tidak memberi komponen atau tidak dapat dibaca, tampilkan not evaluable/warning; jangan membuat komponen palsu untuk menghasilkan check passed.

Control engine **tidak boleh** mengubah amount/date/recipient/status finansial secara autonomous. Jangan auto-renumber, auto-merge, auto-delete atau menganggap cancelled sebagai deleted. Period-locked mutation dan override harus ditegakkan server/database, termasuk correction lintas periode.

## 7. LEVEL 4 — SPENDING INTELLIGENCE [LOCKED]

Gunakan trusted historical structured BKK; jangan membaca ulang PDF sebagai analytical source of truth.

Bangun modul:

- Spend by Category.
- Recipient/Vendor Intelligence.
- Expense Trend / MoM.
- Spending Spike Detection berbasis rule/statistik sederhana.
- Recurring Expense Detection.
- Spending Concentration: Top 5/Top 10 recipient share.
- Cash-Out Forecast v1.

Recipient analytics minimum: total dibayar, transaction count, average, terbesar, terakhir dibayar, category dominan, drill-down ke source BKK.

Recurring detection mempertimbangkan penerima, keterangan, interval dan kisaran nilai; nominal tidak harus identik. Category suggestion bersifat suggestion dan dapat dikoreksi admin, tidak auto-authoritative.

Forecast memakai pendekatan sederhana yang explainable sesuai approved rule, menampilkan periode, data basis, asumsi/metode dan keterbatasan. Actual dan forecast harus terlihat berbeda. Data tidak cukup menghasilkan insufficient-data state, bukan estimate palsu. Hasil spike/recurring merupakan decision support, bukan instruksi pembayaran atau perubahan transaksi otomatis.

Setiap derived result harus traceable ke input BKK/cutoff/rule version. Threshold, matching tolerances, window dan forecast assumptions yang belum disepakati tetap documented proposals.

## 8. LEVEL 5 — INTEGRATION [LOCKED]

Satu canonical bkk_id digunakan Level 1–4. Jangan membuat transaction copy per level. Revisions/historical audit diperbolehkan, tetapi bukan financial ledger lain.

Pisahkan financial values dari extraction/control/audit metadata. Source documents tetap traceable. Raw/unverified tidak masuk financial final. Cancelled tetap tersimpan dan tidak masuk active analytics. Level 3 detection/control tidak auto-correct; Level 4 membaca trusted dataset.

Correction/cancellation/category change harus konsisten memperbarui monitoring, control evaluation, intelligence dan drill-down. Pertahankan before/after history dan revision; jangan menghapus finding/history lama untuk menyamarkan perubahan.

Satu eligibility contract dipakai semua financial readers. Control dapat membaca non-trusted records untuk menemukan unverified/cancelled issues. Jika cache/aggregate dibuat, dataset revision/invalidation wajib eksplisit. Baseline awal query fresh tanpa persistent financial aggregate cache.

## 9. LEVEL 6 — TECHNICAL BASELINE [PROPOSED]

Gunakan proposal berikut untuk foundation/preview, evaluasi terhadap repo aktual, dan dokumentasikan keputusan. Jangan menyebutnya LOCKED sebelum keputusan eksplisit.

| Concern | Proposed baseline |
|---|---|
| Frontend | React + Vite + TypeScript strict |
| Backend | Cloudflare Workers + TypeScript; Hono/router tipis jika membantu |
| Application shape | Modular monolith; satu codebase/release |
| Database | Cloudflare D1, satu per environment |
| Query/schema | Drizzle ORM / Kit; reviewed SQL migrations |
| Migration executor | Wrangler D1 migrations; satu migration history |
| Original documents | R2 private; metadata di D1 |
| Extraction | Native-first hybrid; replaceable OCR/Vision adapters |
| Jobs | Durable D1 job/outbox + Queue, bounded retries/recovery |
| Auth | Cloudflare Access jika domain/user model cocok |
| Permissions | Central server policy, deny-by-default; finance matrix OPEN |
| Unit/integration/E2E | Vitest + Workers/D1 integration + Playwright |
| Environments | LOCAL, STAGING/PREVIEW, PRODUCTION terpisah |
| CI/CD | GitHub Actions; checks sebelum deployment |
| Observability | Redacted technical logs/tracing/metrics; durable audit terpisah |
| Tooling | npm lockfile, supported Node LTS local/CI, pinned compatible versions |

Pisahkan Document, BKK, Monitoring, Financial Control, Audit, Intelligence, Identity dan Infrastructure modules. Browser tidak memegang authoritative financial logic. Jangan menambah Kubernetes, microservices, Kafka, Redis cluster, warehouse, vector DB, AI agent atau custom password system tanpa blocker nyata.

### Data dan financial integrity

Logical entities: users/permissions, documents/upload attempts, extraction jobs/attempts/candidates, canonical BKK, source links, revisions, categories, control findings/resolutions, sequence findings, period locks, audit events, idempotency/outbox.

Proposal exact money: TEXT normalized integer minor units + currency/scale contract; BigInt arithmetic; amount strings di API. Average/MoM/forecast dengan explicit exact arithmetic/rounding. Currency/scale belum otomatis ditetapkan. Jangan parseFloat atau CAST REAL/SQL SUM atas amount TEXT untuk mempermudah perhitungan.

Gunakan PK/FK/checks/indexes dan optimistic versioning. Jangan UNIQUE global no_bkk sebelum identity/sequence scope disepakati. Failed CAS atau locked period harus menggagalkan seluruh mutation/revision/audit/idempotency command. Zero-row UPDATE bukan otomatis rollback error. Buktikan atomicity pada actual D1, bukan menganggap interactive ORM transaction setara PostgreSQL.

### File dan extraction integrity

Original metadata minimum: document id, immutable opaque key, filename, detected MIME, byte size, uploaded_at/by, SHA-256, extraction status dan BKK links. Hash dihitung dari actual bytes server-side. Financial correction tidak mengganti original.

R2, D1 dan Queue bukan satu transaction: implementasikan intermediate states, durable delivery intent dan reconciliation. Retry upload/job tidak membuat financial duplicates. Queue messages berisi references, bukan financial document contents.

Per-page text-quality detection untuk text PDF, scan/image dan mixed documents. Native extraction dulu; OCR hanya jika perlu. Confidence/diagnostics hanya jika tersedia; jangan mengarang score. Pilih parser setelah Worker compatibility/memory/accuracy test; pdfjs-dist kandidat, bukan keputusan final. Vendor OCR dipilih setelah benchmark sample BKK nyata, cost/latency/privacy/limits/reliability; jangan mengirim financial files ke vendor baru tanpa approved data handling.

### Security dan recovery

Verify Access JWT signature/issuer/audience/expiry; mapping actor dari authenticated identity. Jangan percaya userId/role/actor dari browser. Lindungi alternative URLs dan document endpoints dari bypass/IDOR.

R2 original private; source download authorization per request; tidak public predictable links. Upload signature/size/page/pixel validation, safe preview, XSS/injection/SSRF protection, mutation Origin/CSRF checks dan redacted errors. Limits adalah documented technical proposals, bukan silently truncated documents.

Secrets hanya environment secret stores; frontend tidak berisi credential. Local test auth/provider adapters tidak dapat aktif production. Technical logs tidak memuat raw text, PDF, payee, amount, token atau signed URLs. Business audit durable, append-only dan atomik dengan perubahan.

Siapkan DB recovery/Time Travel sesuai plan, independent DB exports dan source backups, checksum manifests, restore runbook dan drill. Jangan menyamakan audit dengan backup, durability dengan accidental-delete recovery, atau code rollback dengan database rollback. Retention/RPO/RTO/backup owner masih memerlukan keputusan. Hindari destructive migration dan produksi schema push.

## 10. OPEN ITEMS — JANGAN DIKARANG

Cari keputusan resmi yang mungkin sudah tersedia sebelum meminta pengguna mengulanginya:

1. VERIFIED vs FINAL eligibility dan FLAGGED interaction.
2. Number uniqueness/sequence scope dan reset; duplicate resolution policy.
3. Period definition, lock/override permissions dan lintas-period corrections.
4. Currency/scale/rounding/display precision.
5. Recipient identity/alias mapping; category taxonomy; thresholds dan analytical parameters.
6. User model/permission matrix, Access/domain/account dan Cloudflare plan.
7. Native parser/OCR provider, private benchmark corpus dan data handling.
8. Upload limits, retention, recovery/alert owner dan operational targets.

Catat item sebagai OPEN, dampak, opsi, recommendation dan apakah memerlukan business decision. Kelompokkan pertanyaan penting agar user tidak ditanya satu per satu setiap langkah. Jangan menetapkan broad admin rights atau memindahkan role model dari project lain.

Untuk demo/test, configurable synthetic policy boleh dipakai dengan label **DEMO — DATA CONTOH**, tanpa real finance data, external exposure atau production activation. Ini tidak menyelesaikan business open items. Jika provider belum terhubung, actual uploaded scan mendapat honest pending/unavailable state; jangan mengembalikan fixture sebagai extraction nyata.

## 11. EXECUTION FLOW

Kerjakan bertahap tanpa menganggap tiap level aplikasi terpisah:

- Phase 0: repository audit, requirement matrix, ADR/open items, architecture checkpoints.
- Phase 1: runnable foundation, navigation/UI shell, typed boundaries, local config, synthetic preview dan CI.
- Phase 2: approved data/lifecycle/permission contracts, persistence/migrations, exact money, auth and atomic audit/CAS/period guard proof.
- Phase 3: document upload/private storage/integrity, durable jobs dan extraction adapters; benchmark native/provider.
- Phase 4: Level 1 working vertical slice sampai verification/finalization dan source drill-down.
- Phase 5: Level 2 Monitoring + Level 3 Control/resolution/period lock.
- Phase 6: Level 4 Intelligence dengan shared Level 5 contracts.
- Phase 7: E2E/security/platform verification, staging smoke, restore drill dan handoff.

Mulai membangun setelah audit ringkas; jangan berhenti pada rencana jika pekerjaan independent sudah authorized. Pada blocker, lanjutkan pekerjaan yang aman dan independen. Preview demo boleh muncul lebih awal, tetapi final status harus membedakan prototype, implemented, tested, blocked dan production-ready.

Jika Cloudflare/GitHub/provider credentials belum tersedia, kerjakan local runnable implementation dan documented configuration; jangan hardcode credential, mengganti architecture diam-diam atau menyatakan deployed. Tampilkan concrete blocker dan setup yang dibutuhkan.

Build/checks gagal → perbaiki sebelum release. Siapkan preview/staging jika akses tersedia dalam scope. Real-data production deployment, perubahan repo visibility dan production migration memerlukan explicit authorization; jangan mengeksekusi berdasarkan asumsi.

## 12. ACCEPTANCE CRITERIA DAN TESTS

Website harus menunjukkan bahwa:

- Satu dokumen multi-BKK menghasilkan separate candidates dengan source mapping.
- Human correction dan verification tersedia; extraction tidak auto-finalize.
- Re-upload/retry tidak double-post financial transactions.
- Unverified/cancelled tidak masuk active financial metrics.
- Filters/KPI/trends/drill-down membaca canonical data yang sama.
- Correction dan cancellation propagates ke Monitoring dan Intelligence dengan audit intact.
- Duplicate/sequence/mismatch findings explainable dan manually resolved.
- Control engine tidak auto-correct; period lock tidak bisa dibypass.
- Forged actor/role, unauthorized source access dan concurrency conflicts fail safely.
- Money round-trips/calculations exact, zero denominator dan insufficient history tertangani.
- Missing credentials/provider, upload failure dan expired jobs memiliki honest states/recovery.

Unit tests untuk parser/domain/lifecycle/calculations/rules; Workers/D1 integration untuk persistence/atomicity/auth/source/job recovery; Playwright untuk upload → correction → verification → dashboard, control → inspect → resolve → audit, correction/cancellation → Level 2/4 propagation.

Mock provider hanya deterministic CI/demo. Real provider benchmark terpisah. SQLite-local pass bukan bukti D1-platform pass. Laporkan commands/results sebenarnya; jangan menulis passed untuk check yang tidak dijalankan.

## 13. DOCUMENTATION DAN HANDOFF

Simpan dalam repo: README setup/run/test/build, locked requirements/invariants, architecture/ADRs dengan status, data/API contracts, implementation status per level, integration/technology findings, environment/secrets guide tanpa secrets, extraction benchmark protocol, deployment/backup/restore runbook.

Jangan commit real financial samples, exports/backups, .env, credentials atau generated sensitive logs. Dokumentasi harus menggambarkan final implementation, bukan rencana yang disajikan seolah sudah jadi.

## 14. FINAL DELIVERY DI ROOM CODEX

Berikan:

1. Website runnable dan preview URL atau local command yang verified.
2. Branch/commit/PR jika dibuat.
3. Status per Level 1–6: implemented/tested/partial/blocked; Level 6 approval status tetap explicit.
4. Ringkasan fitur nyata dan apakah dataset real atau demo.
5. Checks yang dijalankan beserta hasil dan platform limitations.
6. Remaining business/technical open items, exact blockers dan setup yang dibutuhkan.
7. Deployment/readiness status; jangan menyebut production-ready jika critical gates belum lolos.
8. Satu next step paling penting.

**Mulai sekarang dengan repository audit. Lanjutkan membangun fondasi dan website fungsional sesuai scope yang jelas; ajukan keputusan spesifik hanya untuk dependency yang benar-benar belum diputuskan. Pertahankan seluruh invariants Level 1–5, dan jangan menyebut arsitektur Level 6 LOCKED tanpa keputusan eksplisit.**
