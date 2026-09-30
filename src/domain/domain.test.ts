import { describe, expect, it } from 'vitest'
import { dashboardMetrics, groupByCategory, trustedRecords } from './analytics'
import { averageMoney, formatMoney, parseMoney, percentChange, sumMoney } from './money'
import type { BkkRecord } from './types'

const record = (id: string, status: BkkRecord['status'], amount: string, category = 'Operasional'): BkkRecord => ({
  id,
  number: `BKK/${id}`,
  date: '2026-09-01',
  recipient: 'Penerima Contoh',
  description: 'Data sintetis',
  amount,
  category,
  status,
  source: { documentId: 'doc-demo', filename: 'demo.pdf', page: 1 },
  version: 1,
  updatedAt: '2026-09-01T00:00:00.000Z',
})

describe('exact money', () => {
  it('menjumlahkan nilai di atas batas integer aman JavaScript tanpa kehilangan presisi', () => {
    expect(sumMoney(['9007199254740993', '7'])).toBe(9007199254741000n)
  })

  it('menolak decimal dan nilai non-integer', () => {
    expect(() => parseMoney('1200.50')).toThrow()
    expect(() => parseMoney('Rp 1.200')).toThrow()
  })

  it('menghasilkan average exact dengan aturan pembulatan turun BigInt', () => {
    expect(averageMoney(['10', '11', '12'])).toBe(11n)
  })

  it('tidak membuat persentase rekaan ketika denominator nol', () => {
    expect(percentChange(100n, 0n)).toBeNull()
  })

  it('memformat rupiah untuk UI Indonesia', () => {
    expect(formatMoney('12500000')).toContain('12.500.000')
  })
})

describe('shared eligibility demo contract', () => {
  const records = [
    record('1', 'FINAL', '1000', 'A'),
    record('2', 'VERIFIED', '2000', 'B'),
    record('3', 'NEEDS_VERIFICATION', '8000', 'A'),
    record('4', 'CANCELLED', '16000', 'A'),
  ]

  it('hanya memasukkan VERIFIED dan FINAL ke metrik aktif', () => {
    expect(trustedRecords(records).map((item) => item.id)).toEqual(['1', '2'])
    expect(dashboardMetrics(records)).toMatchObject({ count: 2, total: 3000n, average: 1500n })
  })

  it('menggunakan kontrak eligibility yang sama untuk agregasi kategori', () => {
    expect(groupByCategory(records)).toEqual([
      { category: 'B', total: 2000n, count: 1 },
      { category: 'A', total: 1000n, count: 1 },
    ])
  })
})
