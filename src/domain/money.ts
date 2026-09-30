export function parseMoney(value: string): bigint {
  if (!/^-?\d+$/.test(value)) throw new Error('Nominal harus berupa integer unit terkecil')
  return BigInt(value)
}

export function sumMoney(values: string[]): bigint {
  return values.reduce((total, value) => total + parseMoney(value), 0n)
}

export function formatMoney(value: string | bigint): string {
  const amount = typeof value === 'bigint' ? value : parseMoney(value)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function averageMoney(values: string[]): bigint | null {
  if (values.length === 0) return null
  return sumMoney(values) / BigInt(values.length)
}

export function percentChange(current: bigint, previous: bigint): number | null {
  if (previous === 0n) return null
  return Number(((current - previous) * 10_000n) / previous) / 100
}
