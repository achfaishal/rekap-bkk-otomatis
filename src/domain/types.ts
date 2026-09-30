export type BkkStatus = 'EXTRACTED' | 'NEEDS_VERIFICATION' | 'VERIFIED' | 'FINAL' | 'FLAGGED' | 'CANCELLED'
export type DocumentStatus = 'READY' | 'PROCESSING' | 'NEEDS_REVIEW' | 'PROVIDER_UNAVAILABLE' | 'FAILED'
export type FindingStatus = 'OPEN' | 'RESOLVED' | 'DISMISSED'

export interface SourceRef {
  documentId: string
  filename: string
  page: number
  region?: string
}

export interface BkkRecord {
  id: string
  number: string
  date: string
  recipient: string
  description: string
  amount: string
  category: string
  status: BkkStatus
  source: SourceRef
  version: number
  updatedAt: string
  warnings?: string[]
}

export interface SourceDocument {
  id: string
  filename: string
  mime: string
  size: number
  uploadedAt: string
  status: DocumentStatus
  candidateCount: number
  sha256?: string
  message?: string
  synthetic?: boolean
}

export interface Finding {
  id: string
  type: 'DUPLICATE' | 'POTENTIAL_DUPLICATE' | 'SEQUENCE_GAP' | 'TOTAL_MISMATCH' | 'UNVERIFIED' | 'CANCELLED' | 'LARGE_AMOUNT'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  explanation: string
  evidence: string
  bkkId?: string
  status: FindingStatus
  ruleVersion: string
  createdAt: string
  resolution?: { outcome: string; reason: string; resolvedAt: string }
}

export interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  action: string
  entity: string
  entityId: string
  detail: string
  before?: string
  after?: string
}

export interface PeriodLock {
  period: string
  lockedAt: string
  actor: string
  reason: string
}

export interface AppState {
  records: BkkRecord[]
  documents: SourceDocument[]
  findings: Finding[]
  audits: AuditEvent[]
  periodLocks: PeriodLock[]
}
