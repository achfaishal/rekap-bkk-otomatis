import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { initialState } from '../data/demo'
import type { AppState, AuditEvent, BkkRecord, SourceDocument } from '../domain/types'

interface BkkContextValue extends AppState {
  verifyRecord: (id: string, patch: Partial<BkkRecord>) => void
  addUploadedFiles: (files: File[]) => void
  resolveFinding: (id: string, outcome: string, reason: string) => void
  togglePeriodLock: (period: string, reason: string) => void
  resetDemo: () => void
}

const BkkContext = createContext<BkkContextValue | null>(null)
const STORAGE_KEY = 'rekap-bkk-demo-v2'

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) as AppState : initialState
  } catch {
    return initialState
  }
}

export function BkkProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  const commit = (next: AppState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const verifyRecord = (id: string, patch: Partial<BkkRecord>) => {
    const current = state.records.find((record) => record.id === id)
    if (!current) return
    const period = (patch.date ?? current.date).slice(0, 7)
    if (state.periodLocks.some((lock) => lock.period === period)) throw new Error(`Periode ${period} sedang dikunci`)
    const updated: BkkRecord = { ...current, ...patch, status: 'VERIFIED', version: current.version + 1, updatedAt: new Date().toISOString() }
    commit({
      ...state,
      records: state.records.map((record) => record.id === id ? updated : record),
      findings: state.findings.map((finding) => finding.bkkId === id && finding.type === 'UNVERIFIED'
        ? { ...finding, status: 'RESOLVED', resolution: { outcome: 'Terverifikasi', reason: 'Candidate diperiksa dan disahkan manusia', resolvedAt: new Date().toISOString() } }
        : finding),
      audits: [{ id: crypto.randomUUID(), timestamp: new Date().toISOString(), actor: 'Anda · Demo Finance', action: 'BKK_VERIFIED', entity: 'BKK', entityId: id, detail: `${updated.number} diverifikasi manusia.`, before: JSON.stringify({ status: current.status, version: current.version }), after: JSON.stringify({ status: updated.status, version: updated.version }) }, ...state.audits],
    })
  }

  const addUploadedFiles = (files: File[]) => {
    const docs: SourceDocument[] = files.map((file) => ({
      id: crypto.randomUUID(), filename: file.name, mime: file.type || 'application/octet-stream', size: file.size,
      uploadedAt: new Date().toISOString(), status: 'PROVIDER_UNAVAILABLE', candidateCount: 0,
      message: 'File tercatat lokal. Parser/OCR server belum dikonfigurasi; tidak ada BKK finansial yang dibuat.', synthetic: false,
    }))
    commit({
      ...state,
      documents: [...docs, ...state.documents],
      audits: [...docs.map<AuditEvent>((doc) => ({ id: crypto.randomUUID(), timestamp: doc.uploadedAt, actor: 'Anda · Demo Finance', action: 'UPLOAD_RECORDED', entity: 'Dokumen', entityId: doc.id, detail: `${doc.filename} tercatat tanpa ekstraksi; provider belum tersedia.` })), ...state.audits],
    })
  }

  const resolveFinding = (id: string, outcome: string, reason: string) => {
    const finding = state.findings.find((item) => item.id === id)
    if (!finding) return
    commit({
      ...state,
      findings: state.findings.map((item) => item.id === id ? { ...item, status: 'RESOLVED', resolution: { outcome, reason, resolvedAt: new Date().toISOString() } } : item),
      audits: [{ id: crypto.randomUUID(), timestamp: new Date().toISOString(), actor: 'Anda · Demo Finance', action: 'FINDING_RESOLVED', entity: 'Finding', entityId: id, detail: `${finding.title}: ${outcome} — ${reason}` }, ...state.audits],
    })
  }

  const togglePeriodLock = (period: string, reason: string) => {
    const existing = state.periodLocks.find((lock) => lock.period === period)
    const nextLocks = existing ? state.periodLocks.filter((lock) => lock.period !== period) : [...state.periodLocks, { period, reason, lockedAt: new Date().toISOString(), actor: 'Anda · Demo Finance' }]
    commit({
      ...state,
      periodLocks: nextLocks,
      audits: [{ id: crypto.randomUUID(), timestamp: new Date().toISOString(), actor: 'Anda · Demo Finance', action: existing ? 'PERIOD_UNLOCKED' : 'PERIOD_LOCKED', entity: 'Periode', entityId: period, detail: reason }, ...state.audits],
    })
  }

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(initialState)
  }

  const value = useMemo(() => ({ ...state, verifyRecord, addUploadedFiles, resolveFinding, togglePeriodLock, resetDemo }), [state])
  return <BkkContext.Provider value={value}>{children}</BkkContext.Provider>
}

export function useBkk() {
  const value = useContext(BkkContext)
  if (!value) throw new Error('useBkk harus digunakan di dalam BkkProvider')
  return value
}
