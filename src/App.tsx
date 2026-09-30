import { useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import {
  AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, BookOpenCheck,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleDollarSign, ClipboardCheck,
  Clock3, FileArchive, FileCheck2, FileSearch, FileText, Filter, Gauge, History, Inbox, LayoutDashboard,
  Lock, Menu, MoreHorizontal, Plus, RefreshCcw, Search, Settings, ShieldAlert, ShieldCheck, Sparkles,
  TrendingUp, Unlock, UploadCloud, UserRound, UsersRound, WalletCards, X,
} from 'lucide-react'
import { dashboardMetrics, groupByCategory, groupByMonth, groupByRecipient, trustedRecords } from './domain/analytics'
import { formatMoney, percentChange, sumMoney } from './domain/money'
import type { BkkRecord, BkkStatus, Finding } from './domain/types'
import { useBkk } from './state/BkkContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Dokumen', icon: UploadCloud },
  { to: '/verification', label: 'Antrean Verifikasi', icon: ClipboardCheck },
  { to: '/bkk', label: 'Daftar BKK', icon: FileText },
  { to: '/control', label: 'Financial Control', icon: ShieldAlert },
  { to: '/intelligence', label: 'Spending Intelligence', icon: Sparkles },
  { to: '/audit', label: 'Audit Trail', icon: History },
  { to: '/settings', label: 'Period Lock', icon: Lock },
]

const routeMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/dashboard': { eyebrow: 'OVERVIEW', title: 'Selamat pagi, Tim Finance', description: 'Pantau posisi kas keluar dan pekerjaan yang perlu ditindaklanjuti.' },
  '/upload': { eyebrow: 'DIGITALISASI BKK', title: 'Upload Dokumen', description: 'Catat sumber PDF atau gambar tanpa mengubah file asli.' },
  '/verification': { eyebrow: 'HUMAN-IN-THE-LOOP', title: 'Antrean Verifikasi', description: 'Bandingkan hasil ekstraksi dengan dokumen sumber sebelum disahkan.' },
  '/bkk': { eyebrow: 'CANONICAL DATA', title: 'Daftar BKK', description: 'Telusuri seluruh BKK dari satu sumber data yang konsisten.' },
  '/control': { eyebrow: 'FINANCIAL CONTROL', title: 'Exception Queue', description: 'Tinjau temuan, evidence, dan resolusi manusia tanpa koreksi otomatis.' },
  '/intelligence': { eyebrow: 'SPENDING INTELLIGENCE', title: 'Pola Pengeluaran', description: 'Analisis explainable dari data BKK yang sudah dipercaya.' },
  '/audit': { eyebrow: 'TRACEABILITY', title: 'Audit Trail', description: 'Jejak aktivitas append-oriented untuk setiap perubahan penting.' },
  '/settings': { eyebrow: 'PERIOD CONTROL', title: 'Period Lock', description: 'Lindungi periode tutup buku dari perubahan yang tidak disengaja.' },
}

export function App() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const meta = routeMeta[location.pathname] ?? routeMeta['/dashboard']

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><WalletCards size={23} /></div>
          <div><strong>Rekap BKK</strong><span>Finance Control Center</span></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi"><X size={20} /></button>
        </div>
        <nav>
          <p className="nav-label">RUANG KERJA</p>
          {navItems.slice(0, 4).map((item) => <NavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />)}
          <p className="nav-label nav-spacer">KONTROL & ANALISIS</p>
          {navItems.slice(4).map((item) => <NavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />)}
        </nav>
        <div className="sidebar-note">
          <div className="demo-dot" />
          <div><strong>Mode Demo</strong><span>Data contoh sintetis</span></div>
        </div>
        <div className="sidebar-user">
          <div className="avatar">AF</div>
          <div><strong>Admin Finance</strong><span>Demo workspace</span></div>
          <MoreHorizontal size={18} />
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi" />}
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Buka navigasi"><Menu size={21} /></button>
          <div className="global-search"><Search size={18} /><span>Cari BKK, penerima, atau dokumen...</span><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <span className="environment-badge">DEMO — DATA CONTOH</span>
            <button className="icon-button"><Bell size={19} /><i /></button>
          </div>
        </header>
        <div className="page-wrap">
          <div className="page-heading">
            <div><p>{meta.eyebrow}</p><h1>{meta.title}</h1><span>{meta.description}</span></div>
            <div className="heading-date"><CalendarDays size={17} /><span>30 September 2026</span></div>
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/bkk" element={<BkkPage />} />
            <Route path="/control" element={<ControlPage />} />
            <Route path="/intelligence" element={<IntelligencePage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function NavItem({ to, label, icon: Icon, onClick }: (typeof navItems)[number] & { onClick: () => void }) {
  const { records, findings } = useBkk()
  const count = to === '/verification' ? records.filter((record) => record.status === 'NEEDS_VERIFICATION').length : to === '/control' ? findings.filter((finding) => finding.status === 'OPEN').length : 0
  return <NavLink to={to} onClick={onClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={19} /><span>{label}</span>{count > 0 && <b>{count}</b>}</NavLink>
}

function DashboardPage() {
  const { records, findings } = useBkk()
  const metrics = dashboardMetrics(records)
  const monthly = groupByMonth(records)
  const categories = groupByCategory(records)
  const recipients = groupByRecipient(records)
  const september = monthly.find((item) => item.month === '2026-09')?.total ?? metrics.total
  const august = monthly.find((item) => item.month === '2026-08')?.total ?? 0n
  const change = percentChange(september, august)
  const maxMonth = monthly.reduce((max, item) => item.total > max ? item.total : max, 1n)
  const totalForShare = categories.reduce((total, item) => total + item.total, 0n)

  return <>
    <div className="attention-strip">
      <div className="attention-icon"><AlertTriangle size={20} /></div>
      <div><strong>{findings.filter((finding) => finding.status === 'OPEN').length} pengecualian perlu perhatian</strong><span>Termasuk nomor BKK terlewat dan transaksi di atas ambang demo.</span></div>
      <NavLink to="/control">Tinjau sekarang <ArrowRight size={16} /></NavLink>
    </div>
    <div className="metric-grid">
      <MetricCard label="Total Kas Keluar" value={formatMoney(metrics.total)} icon={CircleDollarSign} tone="green" change={change} caption="dibanding Agustus" />
      <MetricCard label="Jumlah BKK Aktif" value={`${metrics.count}`} icon={FileCheck2} tone="blue" change={16.7} caption={`${records.filter((record) => record.status === 'NEEDS_VERIFICATION').length} belum terverifikasi`} />
      <MetricCard label="Rata-rata per BKK" value={formatMoney(metrics.average)} icon={Gauge} tone="amber" change={change === null ? null : change / 2} caption="periode terpilih" />
      <MetricCard label="Transaksi Terbesar" value={metrics.largest ? formatMoney(metrics.largest.amount) : '—'} icon={TrendingUp} tone="purple" caption={metrics.largest?.recipient ?? 'Belum ada data'} />
    </div>
    <div className="dashboard-grid">
      <section className="panel trend-panel">
        <PanelHead title="Tren Kas Keluar" subtitle="Nilai aktual dari BKK eligible" action={<button className="select-button">6 bulan terakhir <ChevronDown size={15} /></button>} />
        <div className="chart-legend"><span><i className="actual-dot" />Aktual</span><span className="chart-total">September <b>{formatMoney(september)}</b></span></div>
        <div className="bar-chart">
          {monthly.map((item) => {
            const height = Number((item.total * 100n) / maxMonth)
            return <div className="bar-column" key={item.month}><div className="bar-tooltip">{formatMoney(item.total)}</div><div className="bar" style={{ height: `${Math.max(height, 7)}%` }} /><span>{new Date(`${item.month}-01`).toLocaleDateString('id-ID', { month: 'short' })}</span></div>
          })}
        </div>
      </section>
      <section className="panel category-panel">
        <PanelHead title="Pengeluaran per Kategori" subtitle="Share terhadap total aktif" action={<NavLink className="text-link" to="/intelligence">Lihat detail</NavLink>} />
        <div className="category-list">
          {categories.slice(0, 5).map((item, index) => {
            const share = totalForShare === 0n ? 0 : Number((item.total * 1000n) / totalForShare) / 10
            return <div className="category-row" key={item.category}><div className={`category-icon color-${index}`}><CategoryIcon index={index} /></div><div className="category-info"><div><strong>{item.category}</strong><span>{item.count} transaksi</span></div><div className="progress-track"><i style={{ width: `${share}%` }} /></div></div><div className="category-amount"><strong>{formatMoney(item.total)}</strong><span>{share.toFixed(1)}%</span></div></div>
          })}
        </div>
      </section>
    </div>
    <div className="dashboard-grid lower-grid">
      <section className="panel">
        <PanelHead title="Penerima Teratas" subtitle="Berdasarkan total pembayaran" action={<NavLink className="text-link" to="/intelligence">Semua penerima</NavLink>} />
        <div className="recipient-table">
          {recipients.slice(0, 4).map((item, index) => <div className="recipient-row" key={item.recipient}><span className="rank">{index + 1}</span><div className="recipient-avatar">{item.recipient.split(' ').slice(0, 2).map((part) => part[0]).join('')}</div><div><strong>{item.recipient}</strong><span>{item.count} transaksi</span></div><b>{formatMoney(item.total)}</b><ChevronRight size={17} /></div>)}
        </div>
      </section>
      <section className="panel">
        <PanelHead title="Aktivitas Terbaru" subtitle="Perubahan penting pada workspace" action={<NavLink className="text-link" to="/audit">Audit lengkap</NavLink>} />
        <RecentActivity />
      </section>
    </div>
  </>
}

function MetricCard({ label, value, icon: Icon, tone, change, caption }: { label: string; value: string; icon: typeof CircleDollarSign; tone: string; change?: number | null; caption: string }) {
  const positive = change != null && change >= 0
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon size={21} /></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><div className="metric-foot">{change != null && <span className={positive ? 'up' : 'down'}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(change).toFixed(1)}%</span>}<span>{caption}</span></div></article>
}

function UploadPage() {
  const { documents, addUploadedFiles } = useBkk()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const onFiles = (files: FileList | null) => { if (files?.length) addUploadedFiles([...files]) }
  return <div className="page-stack">
    <section className="upload-zone" onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); onFiles(event.dataTransfer.files) }} data-dragging={dragging}>
      <input ref={inputRef} type="file" accept="application/pdf,image/png,image/jpeg" multiple hidden onChange={(event) => onFiles(event.target.files)} />
      <div className="upload-illustration"><UploadCloud size={31} /><i /></div>
      <h2>Letakkan dokumen BKK di sini</h2>
      <p>PDF, JPG, atau PNG. Satu dokumen boleh memuat beberapa BKK.</p>
      <button className="primary-button" onClick={() => inputRef.current?.click()}><Plus size={17} /> Pilih Dokumen</button>
      <span className="upload-honesty"><ShieldCheck size={15} /> Upload nyata dicatat, tetapi parser/OCR belum terhubung pada preview lokal.</span>
    </section>
    <section className="panel table-panel">
      <PanelHead title="Dokumen Terbaru" subtitle={`${documents.length} upload attempt tercatat`} action={<button className="ghost-button"><RefreshCcw size={15} /> Segarkan</button>} />
      <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Dokumen</th><th>Diunggah</th><th>Status</th><th>Candidate</th><th>Ukuran</th><th /></tr></thead><tbody>
        {documents.map((doc) => <tr key={doc.id}><td><div className="file-cell"><div className="file-type"><FileText size={19} /></div><div><strong>{doc.filename}</strong><span>{doc.synthetic ? 'Sumber demo sintetis' : doc.message}</span></div></div></td><td>{formatDate(doc.uploadedAt)}<small>{formatTime(doc.uploadedAt)} WIB</small></td><td><DocumentBadge status={doc.status} /></td><td>{doc.candidateCount || '—'}</td><td>{formatBytes(doc.size)}</td><td><button className="row-action"><MoreHorizontal size={18} /></button></td></tr>)}
      </tbody></table></div>
    </section>
  </div>
}

function VerificationPage() {
  const { records, verifyRecord } = useBkk()
  const pending = records.filter((record) => record.status === 'NEEDS_VERIFICATION' || record.status === 'EXTRACTED')
  const [selectedId, setSelectedId] = useState(pending[0]?.id ?? '')
  const selected = pending.find((record) => record.id === selectedId) ?? pending[0]
  if (!selected) return <EmptyState icon={CheckCircle2} title="Antrean verifikasi kosong" text="Semua candidate telah ditinjau manusia." />
  return <VerificationWorkspace key={selected.id} record={selected} pending={pending} select={setSelectedId} verify={verifyRecord} />
}

function VerificationWorkspace({ record, pending, select, verify }: { record: BkkRecord; pending: BkkRecord[]; select: (id: string) => void; verify: (id: string, patch: Partial<BkkRecord>) => void }) {
  const [form, setForm] = useState(record)
  const [success, setSuccess] = useState('')
  const update = (field: keyof BkkRecord, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent) => { event.preventDefault(); try { verify(record.id, form); setSuccess(`${form.number} berhasil diverifikasi.`) } catch (error) { setSuccess(error instanceof Error ? error.message : 'Verifikasi gagal') } }
  if (success) return <div className="success-state"><div><Check size={33} /></div><h2>{success}</h2><p>Perubahan tersimpan di dataset bersama dan audit trail ditambahkan.</p><NavLink className="primary-button" to="/dashboard">Kembali ke dashboard</NavLink></div>
  return <div className="verification-layout">
    <aside className="queue-panel panel"><div className="queue-head"><span>{pending.length} MENUNGGU</span><Filter size={16} /></div>{pending.map((item) => <button key={item.id} className={`queue-item ${item.id === record.id ? 'selected' : ''}`} onClick={() => select(item.id)}><div><strong>{item.number}</strong><span>{item.source.filename}</span></div><small>Hal. {item.source.page}</small></button>)}</aside>
    <section className="source-viewer panel">
      <div className="source-toolbar"><div><FileText size={18} /><strong>{record.source.filename}</strong><span>Halaman {record.source.page}</span></div><button className="ghost-button"><FileSearch size={15} /> Buka sumber</button></div>
      <div className="paper-sheet">
        <div className="paper-title"><span>BUKTI KAS KELUAR</span><small>Dokumen sumber sintetis</small></div>
        <div className="paper-number">No. <b>{record.number}</b></div>
        <div className="paper-field"><span>Dibayar kepada</span><strong>{record.recipient}</strong></div>
        <div className="paper-field"><span>Tanggal</span><strong>{formatDate(record.date)}</strong></div>
        <div className="paper-field tall"><span>Untuk pembayaran</span><strong>{record.description}</strong></div>
        <div className="paper-total"><span>JUMLAH</span><strong>{formatMoney(record.amount)}</strong></div>
        <div className="paper-signatures"><span>Disiapkan</span><span>Diperiksa</span><span>Disetujui</span></div>
        <div className="source-region-label">REGION TERDETEKSI · PAGE {record.source.page}</div>
      </div>
    </section>
    <form className="verify-form panel" onSubmit={submit}>
      <div className="form-head"><div><h3>Hasil Ekstraksi</h3><span>Periksa setiap field dengan source</span></div><Badge status={record.status} /></div>
      {record.warnings?.map((warning) => <div className="warning-line" key={warning}><AlertTriangle size={15} /><span>{warning}</span></div>)}
      <FormField label="Nomor BKK"><input value={form.number} onChange={(event) => update('number', event.target.value)} /></FormField>
      <FormField label="Tanggal BKK"><input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} /></FormField>
      <FormField label="Dibayar kepada"><input value={form.recipient} onChange={(event) => update('recipient', event.target.value)} /></FormField>
      <FormField label="Keterangan"><textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows={3} /></FormField>
      <FormField label="Total (rupiah)"><input inputMode="numeric" value={form.amount} onChange={(event) => update('amount', event.target.value.replace(/\D/g, ''))} /></FormField>
      <FormField label="Kategori"><select value={form.category} onChange={(event) => update('category', event.target.value)}><option>Transportasi</option><option>Operasional Kantor</option><option>Utilitas</option><option>Teknologi</option><option>Perjalanan Dinas</option><option>Aset & Perlengkapan</option></select></FormField>
      <div className="form-actions"><button type="button" className="ghost-button">Simpan draf</button><button className="primary-button" type="submit"><CheckCircle2 size={17} /> Verifikasi BKK</button></div>
      <p className="authority-note"><ShieldCheck size={14} /> Verifikasi selalu merupakan perintah manusia. Ekstraksi tidak pernah melakukan finalisasi.</p>
    </form>
  </div>
}

function BkkPage() {
  const { records } = useBkk()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [detail, setDetail] = useState<BkkRecord | null>(null)
  const filtered = records.filter((record) => (status === 'ALL' || record.status === status) && `${record.number} ${record.recipient} ${record.description}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="panel table-panel bkk-list-panel">
    <div className="table-tools"><div className="table-search"><Search size={17} /><input placeholder="Cari nomor, penerima, keterangan..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><select className="select-button" value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">Semua status</option><option value="FINAL">Final</option><option value="VERIFIED">Terverifikasi</option><option value="NEEDS_VERIFICATION">Perlu verifikasi</option><option value="CANCELLED">Dibatalkan</option></select><button className="ghost-button"><Filter size={15} /> Filter lanjutan</button></div>
    <div className="table-summary"><strong>{filtered.length} BKK</strong><span>Periode tanggal BKK · seluruh status</span><button>Ekspor daftar <ChevronDown size={14} /></button></div>
    <div className="data-table-wrap"><table className="data-table bkk-table"><thead><tr><th>Nomor BKK</th><th>Tanggal</th><th>Dibayar kepada</th><th>Kategori</th><th>Status</th><th className="align-right">Total</th><th /></tr></thead><tbody>
      {filtered.map((record) => <tr key={record.id} onClick={() => setDetail(record)}><td><strong>{record.number}</strong><small>Versi {record.version} · Hal. {record.source.page}</small></td><td>{formatDate(record.date)}</td><td><strong>{record.recipient}</strong><small>{record.description}</small></td><td><span className="category-chip">{record.category}</span></td><td><Badge status={record.status} /></td><td className="align-right amount-cell">{formatMoney(record.amount)}</td><td><ChevronRight size={17} /></td></tr>)}
    </tbody></table></div>
    <div className="pagination"><span>Menampilkan 1–{filtered.length} dari {filtered.length}</span><div><button disabled>‹</button><button className="active">1</button><button disabled>›</button></div></div>
    {detail && <BkkDrawer record={detail} onClose={() => setDetail(null)} />}
  </section>
}

function BkkDrawer({ record, onClose }: { record: BkkRecord; onClose: () => void }) {
  return <><button className="drawer-backdrop" onClick={onClose} aria-label="Tutup detail" /><aside className="detail-drawer"><div className="drawer-head"><div><span>DETAIL BKK</span><h2>{record.number}</h2></div><button onClick={onClose}><X size={20} /></button></div><div className="drawer-status"><Badge status={record.status} /><span>Versi {record.version}</span></div><div className="detail-total"><span>Total pembayaran</span><strong>{formatMoney(record.amount)}</strong></div><div className="detail-fields"><DetailField label="Tanggal BKK" value={formatDate(record.date)} /><DetailField label="Dibayar kepada" value={record.recipient} /><DetailField label="Kategori" value={record.category} /><DetailField label="Keterangan" value={record.description} /></div><div className="source-card"><FileText size={22} /><div><strong>{record.source.filename}</strong><span>Halaman {record.source.page} · Dokumen asli tidak berubah</span></div><ChevronRight size={18} /></div><div className="trace-card"><h3>Keterlacakan</h3><div><i /><span><b>Candidate dihubungkan</b><small>Source page {record.source.page}</small></span></div><div><i /><span><b>Verifikasi manusia</b><small>{formatDateTime(record.updatedAt)}</small></span></div><div><i className="muted" /><span><b>Audit tersedia</b><small>Canonical ID {record.id}</small></span></div></div></aside></>
}

function ControlPage() {
  const { findings, resolveFinding } = useBkk()
  const [selected, setSelected] = useState<Finding | null>(null)
  const open = findings.filter((finding) => finding.status === 'OPEN')
  return <div className="control-layout">
    <div className="control-summary">
      <div><span className="control-icon high"><ShieldAlert size={21} /></span><div><strong>{open.filter((item) => item.severity === 'HIGH').length}</strong><span>Prioritas tinggi</span></div></div>
      <div><span className="control-icon medium"><AlertTriangle size={21} /></span><div><strong>{open.filter((item) => item.severity === 'MEDIUM').length}</strong><span>Perlu ditinjau</span></div></div>
      <div><span className="control-icon resolved"><ShieldCheck size={21} /></span><div><strong>{findings.filter((item) => item.status === 'RESOLVED').length}</strong><span>Selesai ditangani</span></div></div>
      <div><span className="control-icon neutral"><Clock3 size={21} /></span><div><strong>1,4 hari</strong><span>Rata-rata resolusi demo</span></div></div>
    </div>
    <section className="panel finding-panel"><div className="finding-toolbar"><div><button className="tab active">Terbuka <b>{open.length}</b></button><button className="tab">Diselesaikan</button><button className="tab">Semua</button></div><button className="ghost-button"><Filter size={15} /> Jenis temuan</button></div>
      <div className="finding-list">{open.map((finding) => <button key={finding.id} onClick={() => setSelected(finding)} className="finding-row"><SeverityBadge severity={finding.severity} /><div className="finding-main"><div><span className="finding-type">{finding.type.replaceAll('_', ' ')}</span><small>{formatDateTime(finding.createdAt)}</small></div><strong>{finding.title}</strong><p>{finding.explanation}</p><span className="evidence"><BookOpenCheck size={14} />{finding.evidence}</span></div><div className="rule-version"><span>RULE</span><b>{finding.ruleVersion}</b></div><ChevronRight size={19} /></button>)}</div>
    </section>
    {selected && <ResolutionModal finding={selected} close={() => setSelected(null)} resolve={(outcome, reason) => { resolveFinding(selected.id, outcome, reason); setSelected(null) }} />}
  </div>
}

function ResolutionModal({ finding, close, resolve }: { finding: Finding; close: () => void; resolve: (outcome: string, reason: string) => void }) {
  const [outcome, setOutcome] = useState('Dikonfirmasi aman')
  const [reason, setReason] = useState('')
  return <><button className="modal-backdrop" onClick={close} aria-label="Tutup modal" /><div className="modal"><div className="modal-head"><div><span>RESOLUSI MANUAL</span><h2>{finding.title}</h2></div><button onClick={close}><X size={20} /></button></div><div className="modal-evidence"><strong>Evidence</strong><p>{finding.evidence}</p><small>Rule {finding.ruleVersion} · engine tidak mengubah data finansial.</small></div><FormField label="Hasil peninjauan"><select value={outcome} onChange={(event) => setOutcome(event.target.value)}><option>Dikonfirmasi aman</option><option>Duplikat terkonfirmasi</option><option>Perlu koreksi terpisah</option><option>False positive</option></select></FormField><FormField label="Alasan resolusi"><textarea rows={4} placeholder="Jelaskan dasar keputusan..." value={reason} onChange={(event) => setReason(event.target.value)} /></FormField><div className="form-actions"><button className="ghost-button" onClick={close}>Batal</button><button className="primary-button" disabled={!reason.trim()} onClick={() => resolve(outcome, reason)}><CheckCircle2 size={17} /> Simpan resolusi</button></div></div></>
}

function IntelligencePage() {
  const { records } = useBkk()
  const trusted = trustedRecords(records)
  const recipients = groupByRecipient(records)
  const categories = groupByCategory(records)
  const total = sumMoney(trusted.map((record) => record.amount))
  const top5 = recipients.slice(0, 5).reduce((sum, item) => sum + item.total, 0n)
  const concentration = total === 0n ? null : Number((top5 * 1000n) / total) / 10
  return <div className="page-stack">
    <div className="intelligence-banner"><div className="spark-icon"><Sparkles size={23} /></div><div><strong>Decision support, bukan instruksi pembayaran</strong><span>Seluruh insight di bawah berasal dari BKK terverifikasi/final pada kebijakan demo. Tidak ada PDF yang dibaca ulang.</span></div><span>RULE SET · DEMO V1</span></div>
    <div className="insight-grid">
      <section className="panel insight-card"><div className="insight-card-head"><span className="insight-icon"><UsersRound size={20} /></span><div><strong>Konsentrasi Penerima</strong><span>Top 5 share</span></div></div><div className="donut-wrap"><div className="donut" style={{ '--share': `${concentration ?? 0}%` } as React.CSSProperties}><div><strong>{concentration?.toFixed(1) ?? '—'}%</strong><span>dari total</span></div></div><p>Belum ada indikasi risiko konsentrasi berdasarkan parameter demo.</p></div></section>
      <section className="panel insight-card"><div className="insight-card-head"><span className="insight-icon amber"><TrendingUp size={20} /></span><div><strong>Spending Spike</strong><span>Perubahan tidak biasa</span></div></div><div className="insight-stat"><strong>1</strong><span>pola perlu ditinjau</span></div><p>Pengeluaran Teknologi meningkat karena langganan tahunan. Threshold final masih OPEN.</p><NavLink to="/control" className="text-link">Lihat evidence <ArrowRight size={14} /></NavLink></section>
      <section className="panel insight-card"><div className="insight-card-head"><span className="insight-icon purple"><RefreshCcw size={20} /></span><div><strong>Biaya Berulang</strong><span>Pola penerima & interval</span></div></div><div className="insight-stat"><strong>2</strong><span>pola terdeteksi</span></div><p>Utilitas listrik dan pemeliharaan kendaraan muncul pada lebih dari satu periode.</p><button className="text-link">Tinjau pola <ArrowRight size={14} /></button></section>
    </div>
    <div className="dashboard-grid intelligence-lower">
      <section className="panel"><PanelHead title="Recipient Intelligence" subtitle="Ringkasan dari canonical BKK" /><div className="recipient-intel-list">{recipients.slice(0, 5).map((item) => { const dominant = [...item.categories].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'; return <div key={item.recipient}><div className="recipient-avatar">{item.recipient.split(' ').slice(0, 2).map((part) => part[0]).join('')}</div><div><strong>{item.recipient}</strong><span>{dominant} · terakhir {formatDate(item.lastPaid)}</span></div><div><strong>{formatMoney(item.total)}</strong><span>{item.count} transaksi · rata-rata {formatMoney(item.total / BigInt(item.count))}</span></div><ChevronRight size={18} /></div>})}</div></section>
      <section className="panel forecast-card"><PanelHead title="Cash-Out Forecast v1" subtitle="Status metode & kesiapan data" /><div className="forecast-empty"><div><BarChart3 size={28} /></div><h3>Data historis belum cukup</h3><p>Forecast memerlukan rangkaian periode yang memadai. Preview tidak membuat estimasi palsu dari dua bulan data contoh.</p><ul><li><Check size={14} /> Cutoff data: 30 Sep 2026</li><li><Check size={14} /> Aktual dan forecast akan dipisahkan</li><li><AlertTriangle size={14} /> Metode & window final masih OPEN</li></ul></div></section>
    </div>
    <section className="panel"><PanelHead title="Komposisi Kategori" subtitle="Jumlah dan total dari dataset eligible" /><div className="category-composition">{categories.map((item, index) => <div key={item.category}><span className={`composition-dot color-${index}`} /><div><strong>{item.category}</strong><span>{item.count} BKK</span></div><b>{formatMoney(item.total)}</b></div>)}</div></section>
  </div>
}

function AuditPage() {
  const { audits } = useBkk()
  return <section className="panel table-panel"><div className="table-tools"><div className="table-search"><Search size={17} /><input placeholder="Cari aktivitas atau entity..." /></div><button className="select-button">Semua aksi <ChevronDown size={14} /></button><button className="ghost-button"><CalendarDays size={15} /> Rentang tanggal</button></div><div className="audit-notice"><ShieldCheck size={17} /><span>Audit pada preview bersifat append-oriented di local storage. Implementasi D1 atomik masih menunggu kontrak dan platform gate.</span></div><div className="audit-list">{audits.map((event) => <div className="audit-row" key={event.id}><div className="audit-time"><strong>{formatTime(event.timestamp)} WIB</strong><span>{formatDate(event.timestamp)}</span></div><div className="audit-line"><i /></div><div className="audit-icon"><AuditIcon action={event.action} /></div><div className="audit-content"><div><strong>{event.action.replaceAll('_', ' ')}</strong><span>{event.entity} · {event.entityId}</span></div><p>{event.detail}</p>{event.before && <div className="diff"><span>{event.before}</span><ArrowRight size={13} /><b>{event.after}</b></div>}<small><UserRound size={13} /> {event.actor}</small></div></div>)}</div></section>
}

function SettingsPage() {
  const { periodLocks, togglePeriodLock, resetDemo } = useBkk()
  const [period, setPeriod] = useState('2026-09')
  const [reason, setReason] = useState('Tutup buku bulanan')
  const locked = periodLocks.some((lock) => lock.period === period)
  return <div className="settings-grid"><section className="panel lock-panel"><div className="lock-hero"><div className={locked ? 'locked' : ''}>{locked ? <Lock size={28} /> : <Unlock size={28} />}</div><div><span>STATUS PERIODE</span><h2>{formatPeriod(period)}</h2><p>{locked ? 'Perubahan BKK pada periode ini akan ditolak oleh guard demo.' : 'Periode masih terbuka untuk verifikasi dan koreksi.'}</p></div><Badge status={locked ? 'LOCKED' : 'OPEN'} /></div><div className="lock-form"><FormField label="Pilih periode"><input type="month" value={period} onChange={(event) => setPeriod(event.target.value)} /></FormField><FormField label="Alasan"><input value={reason} onChange={(event) => setReason(event.target.value)} /></FormField><button className={locked ? 'danger-button' : 'primary-button'} onClick={() => togglePeriodLock(period, locked ? 'Periode dibuka kembali pada demo' : reason)}>{locked ? <><Unlock size={17} /> Buka periode</> : <><Lock size={17} /> Kunci periode</>}</button></div><div className="policy-warning"><AlertTriangle size={17} /><div><strong>Kebijakan demo, bukan izin produksi</strong><span>Authority lock/override, definisi periode, dan koreksi lintas periode masih membutuhkan keputusan bisnis resmi.</span></div></div></section><section className="panel"><PanelHead title="Riwayat Period Lock" subtitle="Perubahan terakhir pada workspace demo" /><div className="lock-history">{periodLocks.length === 0 ? <EmptyState compact icon={Unlock} title="Belum ada periode dikunci" text="Gunakan form di sebelah kiri untuk menguji guard demo." /> : periodLocks.map((lock) => <div key={lock.period}><span className="control-icon high"><Lock size={18} /></span><div><strong>{formatPeriod(lock.period)}</strong><span>{lock.reason}</span><small>{lock.actor} · {formatDateTime(lock.lockedAt)}</small></div></div>)}</div><div className="reset-box"><div><strong>Reset workspace demo</strong><span>Kembalikan seluruh data contoh ke kondisi awal.</span></div><button className="ghost-button" onClick={resetDemo}><RefreshCcw size={15} /> Reset data</button></div></section></div>
}

function PanelHead({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) { return <div className="panel-head"><div><h2>{title}</h2><span>{subtitle}</span></div>{action}</div> }
function FormField({ label, children }: { label: string; children: ReactNode }) { return <label className="form-field"><span>{label}</span>{children}</label> }
function DetailField({ label, value }: { label: string; value: string }) { return <div className="detail-field"><span>{label}</span><strong>{value}</strong></div> }
function Badge({ status }: { status: string }) { return <span className={`status-badge status-${status.toLowerCase()}`}><i />{statusLabel(status)}</span> }
function SeverityBadge({ severity }: { severity: Finding['severity'] }) { return <span className={`severity ${severity.toLowerCase()}`}><i />{severity === 'HIGH' ? 'Tinggi' : severity === 'MEDIUM' ? 'Sedang' : 'Rendah'}</span> }
function DocumentBadge({ status }: { status: string }) { return <span className={`document-badge doc-${status.toLowerCase()}`}>{status === 'NEEDS_REVIEW' ? <Clock3 size={14} /> : status === 'PROVIDER_UNAVAILABLE' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}{status === 'NEEDS_REVIEW' ? 'Perlu review' : status === 'PROVIDER_UNAVAILABLE' ? 'Provider belum ada' : status === 'READY' ? 'Siap' : status}</span> }
function EmptyState({ icon: Icon, title, text, compact = false }: { icon: typeof CheckCircle2; title: string; text: string; compact?: boolean }) { return <div className={`empty-state ${compact ? 'compact' : ''}`}><Icon size={compact ? 25 : 36} /><h2>{title}</h2><p>{text}</p></div> }
function RecentActivity() { const { audits } = useBkk(); return <div className="activity-list">{audits.slice(0, 4).map((event) => <div key={event.id}><div className="activity-icon"><AuditIcon action={event.action} /></div><div><p>{event.detail}</p><span>{event.actor} · {relativeTime(event.timestamp)}</span></div></div>)}</div> }
function AuditIcon({ action }: { action: string }) { if (action.includes('UPLOAD') || action.includes('EXTRACTION')) return <UploadCloud size={16} />; if (action.includes('LOCK')) return <Lock size={16} />; if (action.includes('RESOLVED')) return <ShieldCheck size={16} />; return <CheckCircle2 size={16} /> }
function CategoryIcon({ index }: { index: number }) { const icons = [FileArchive, CircleDollarSign, TrendingUp, Gauge, WalletCards]; const Icon = icons[index % icons.length]; return <Icon size={17} /> }

function statusLabel(status: string) {
  const labels: Record<string, string> = { FINAL: 'Final', VERIFIED: 'Terverifikasi', NEEDS_VERIFICATION: 'Perlu verifikasi', EXTRACTED: 'Terekstrak', FLAGGED: 'Ditandai', CANCELLED: 'Dibatalkan', LOCKED: 'Terkunci', OPEN: 'Terbuka' }
  return labels[status] ?? status
}
function formatDate(value: string) { return new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }
function formatTime(value: string) { return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) }
function formatDateTime(value: string) { return `${formatDate(value)}, ${formatTime(value)} WIB` }
function formatPeriod(value: string) { return new Date(`${value}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) }
function formatBytes(size: number) { return size < 1_000_000 ? `${Math.round(size / 1000)} KB` : `${(size / 1_000_000).toFixed(1)} MB` }
function relativeTime(value: string) { const hours = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 3_600_000)); return hours > 24 ? `${Math.round(hours / 24)} hari lalu` : `${hours} jam lalu` }
