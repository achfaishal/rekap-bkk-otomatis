import type { AppState, AuditEvent, BkkRecord, Finding, SourceDocument } from '../domain/types'

const now = '2026-09-30T09:15:00.000Z'

export const demoDocuments: SourceDocument[] = [
  { id: 'doc-001', filename: 'BKK-Operasional-September.pdf', mime: 'application/pdf', size: 1840000, uploadedAt: '2026-09-30T08:05:00.000Z', status: 'NEEDS_REVIEW', candidateCount: 2, sha256: 'demo-5f52d9…93ea', synthetic: true },
  { id: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', mime: 'application/pdf', size: 920000, uploadedAt: '2026-09-28T03:20:00.000Z', status: 'READY', candidateCount: 3, sha256: 'demo-9acd31…2b07', synthetic: true },
  { id: 'doc-003', filename: 'Scan-BKK-September.jpg', mime: 'image/jpeg', size: 2460000, uploadedAt: '2026-09-29T06:40:00.000Z', status: 'READY', candidateCount: 1, sha256: 'demo-746ee3…d1b9', synthetic: true },
]

export const demoRecords: BkkRecord[] = [
  { id: 'bkk-001', number: 'BKK/2026/0901', date: '2026-09-03', recipient: 'PT Sumber Karya', description: 'Pembelian alat tulis kantor', amount: '4850000', category: 'Operasional Kantor', status: 'FINAL', source: { documentId: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', page: 1, region: 'x:42 y:80 w:510 h:310' }, version: 2, updatedAt: '2026-09-28T04:00:00.000Z' },
  { id: 'bkk-002', number: 'BKK/2026/0902', date: '2026-09-05', recipient: 'CV Maju Bersama', description: 'Pemeliharaan kendaraan operasional', amount: '12500000', category: 'Transportasi', status: 'VERIFIED', source: { documentId: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', page: 2 }, version: 1, updatedAt: '2026-09-28T04:06:00.000Z' },
  { id: 'bkk-003', number: 'BKK/2026/0903', date: '2026-09-08', recipient: 'PT Listrik Nusantara', description: 'Tagihan listrik kantor September', amount: '8750000', category: 'Utilitas', status: 'FINAL', source: { documentId: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', page: 3 }, version: 1, updatedAt: '2026-09-28T04:08:00.000Z' },
  { id: 'bkk-004', number: 'BKK/2026/0905', date: '2026-09-12', recipient: 'PT Sumber Karya', description: 'Pengadaan kursi kerja', amount: '18750000', category: 'Aset & Perlengkapan', status: 'FINAL', source: { documentId: 'doc-003', filename: 'Scan-BKK-September.jpg', page: 1 }, version: 2, updatedAt: '2026-09-29T07:10:00.000Z' },
  { id: 'bkk-005', number: 'BKK/2026/0906', date: '2026-09-18', recipient: 'Hotel Cendana', description: 'Akomodasi perjalanan dinas', amount: '7250000', category: 'Perjalanan Dinas', status: 'VERIFIED', source: { documentId: 'doc-003', filename: 'Scan-BKK-September.jpg', page: 1 }, version: 1, updatedAt: '2026-09-29T07:12:00.000Z' },
  { id: 'bkk-006', number: 'BKK/2026/0907', date: '2026-09-22', recipient: 'PT Solusi Data', description: 'Langganan perangkat lunak tahunan', amount: '24000000', category: 'Teknologi', status: 'FINAL', source: { documentId: 'doc-001', filename: 'BKK-Operasional-September.pdf', page: 1 }, version: 1, updatedAt: now },
  { id: 'bkk-007', number: 'BKK/2026/0908', date: '2026-09-24', recipient: 'CV Maju Bersama', description: 'Servis kendaraan operasional', amount: '3600000', category: 'Transportasi', status: 'NEEDS_VERIFICATION', source: { documentId: 'doc-001', filename: 'BKK-Operasional-September.pdf', page: 2 }, version: 1, updatedAt: now, warnings: ['Nomor rekening pada source kurang terbaca', 'Kategori merupakan saran dan perlu dikonfirmasi'] },
  { id: 'bkk-008', number: 'BKK/2026/0828', date: '2026-08-06', recipient: 'PT Listrik Nusantara', description: 'Tagihan listrik kantor Agustus', amount: '8100000', category: 'Utilitas', status: 'FINAL', source: { documentId: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', page: 4 }, version: 1, updatedAt: '2026-08-07T05:00:00.000Z' },
  { id: 'bkk-009', number: 'BKK/2026/0829', date: '2026-08-13', recipient: 'PT Sumber Karya', description: 'Pembelian kebutuhan pantry', amount: '3150000', category: 'Operasional Kantor', status: 'FINAL', source: { documentId: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', page: 5 }, version: 1, updatedAt: '2026-08-14T05:00:00.000Z' },
  { id: 'bkk-010', number: 'BKK/2026/0830', date: '2026-08-21', recipient: 'PT Solusi Data', description: 'Dukungan sistem bulanan', amount: '6500000', category: 'Teknologi', status: 'CANCELLED', source: { documentId: 'doc-002', filename: 'BKK-Vendor-Agustus.pdf', page: 6 }, version: 2, updatedAt: '2026-08-22T05:00:00.000Z' },
]

export const demoFindings: Finding[] = [
  { id: 'find-001', type: 'SEQUENCE_GAP', severity: 'HIGH', title: 'Nomor BKK terlewat', explanation: 'Urutan data contoh berpindah dari 0903 ke 0905.', evidence: 'Nomor yang tidak ditemukan: BKK/2026/0904. Scope urutan resmi masih OPEN.', status: 'OPEN', ruleVersion: 'demo-sequence-v1', createdAt: '2026-09-30T09:20:00.000Z' },
  { id: 'find-002', type: 'UNVERIFIED', severity: 'MEDIUM', title: 'BKK menunggu verifikasi', explanation: 'Candidate telah diekstrak tetapi belum disahkan manusia.', evidence: 'BKK/2026/0908 · versi 1', bkkId: 'bkk-007', status: 'OPEN', ruleVersion: 'demo-lifecycle-v1', createdAt: '2026-09-30T09:21:00.000Z' },
  { id: 'find-003', type: 'LARGE_AMOUNT', severity: 'MEDIUM', title: 'Nominal di atas ambang demo', explanation: 'Nilai transaksi melewati parameter contoh Rp20.000.000.', evidence: 'BKK/2026/0907 · Rp24.000.000. Threshold final masih OPEN.', bkkId: 'bkk-006', status: 'OPEN', ruleVersion: 'demo-large-amount-v1', createdAt: '2026-09-30T09:22:00.000Z' },
  { id: 'find-004', type: 'CANCELLED', severity: 'LOW', title: 'BKK dibatalkan tersimpan', explanation: 'Record tetap dipertahankan untuk audit dan tidak masuk metrik aktif.', evidence: 'BKK/2026/0830 · pembatalan tercatat', bkkId: 'bkk-010', status: 'RESOLVED', ruleVersion: 'demo-lifecycle-v1', createdAt: '2026-08-22T05:05:00.000Z', resolution: { outcome: 'Dikonfirmasi', reason: 'Pembayaran dibatalkan oleh Finance', resolvedAt: '2026-08-22T06:00:00.000Z' } },
]

export const demoAudits: AuditEvent[] = [
  { id: 'audit-001', timestamp: '2026-09-30T09:15:00.000Z', actor: 'Rina · Finance Admin', action: 'EXTRACTION_COMPLETED', entity: 'Dokumen', entityId: 'doc-001', detail: '2 candidate ditemukan; 1 perlu verifikasi manusia.' },
  { id: 'audit-002', timestamp: '2026-09-29T07:12:00.000Z', actor: 'Dimas · Verifikator', action: 'BKK_VERIFIED', entity: 'BKK', entityId: 'bkk-005', detail: 'BKK/2026/0906 diverifikasi dari source halaman 1.', before: 'NEEDS_VERIFICATION', after: 'VERIFIED' },
  { id: 'audit-003', timestamp: '2026-09-29T07:10:00.000Z', actor: 'Dimas · Verifikator', action: 'BKK_CORRECTED', entity: 'BKK', entityId: 'bkk-004', detail: 'Kategori dikoreksi berdasarkan source.', before: 'Operasional Kantor', after: 'Aset & Perlengkapan' },
  { id: 'audit-004', timestamp: '2026-09-28T04:00:00.000Z', actor: 'Rina · Finance Admin', action: 'BKK_FINALIZED', entity: 'BKK', entityId: 'bkk-001', detail: 'BKK ditandai final setelah pemeriksaan source.' },
]

export const initialState: AppState = {
  records: demoRecords,
  documents: demoDocuments,
  findings: demoFindings,
  audits: demoAudits,
  periodLocks: [],
}
