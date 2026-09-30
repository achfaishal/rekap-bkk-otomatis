import type { BkkRecord } from './types'
import { averageMoney, sumMoney } from './money'

// DEMO policy only. The official VERIFIED/FINAL/FLAGGED contract remains OPEN.
export const isDemoEligible = (record: BkkRecord) =>
  record.status === 'VERIFIED' || record.status === 'FINAL'

export function trustedRecords(records: BkkRecord[]): BkkRecord[] {
  return records.filter(isDemoEligible)
}

export function dashboardMetrics(records: BkkRecord[]) {
  const eligible = trustedRecords(records)
  const amounts = eligible.map((record) => record.amount)
  const total = sumMoney(amounts)
  const average = averageMoney(amounts) ?? 0n
  const largest = eligible.reduce<BkkRecord | null>((top, record) => {
    if (!top) return record
    return BigInt(record.amount) > BigInt(top.amount) ? record : top
  }, null)
  return { count: eligible.length, total, average, largest }
}

export function groupByCategory(records: BkkRecord[]) {
  const groups = new Map<string, { category: string; total: bigint; count: number }>()
  for (const record of trustedRecords(records)) {
    const current = groups.get(record.category) ?? { category: record.category, total: 0n, count: 0 }
    current.total += BigInt(record.amount)
    current.count += 1
    groups.set(record.category, current)
  }
  return [...groups.values()].sort((a, b) => (a.total > b.total ? -1 : 1))
}

export function groupByMonth(records: BkkRecord[]) {
  const groups = new Map<string, bigint>()
  for (const record of trustedRecords(records)) {
    const month = record.date.slice(0, 7)
    groups.set(month, (groups.get(month) ?? 0n) + BigInt(record.amount))
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => ({ month, total }))
}

export function groupByRecipient(records: BkkRecord[]) {
  const groups = new Map<string, { recipient: string; total: bigint; count: number; lastPaid: string; categories: Map<string, number> }>()
  for (const record of trustedRecords(records)) {
    const current = groups.get(record.recipient) ?? {
      recipient: record.recipient,
      total: 0n,
      count: 0,
      lastPaid: record.date,
      categories: new Map<string, number>(),
    }
    current.total += BigInt(record.amount)
    current.count += 1
    if (record.date > current.lastPaid) current.lastPaid = record.date
    current.categories.set(record.category, (current.categories.get(record.category) ?? 0) + 1)
    groups.set(record.recipient, current)
  }
  return [...groups.values()].sort((a, b) => (a.total > b.total ? -1 : 1))
}
