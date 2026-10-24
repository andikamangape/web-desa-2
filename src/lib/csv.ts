const escapeCsv = (value: string) => {
  const s = value ?? ''
  if (/[",\n;]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

export interface CsvRow {
  [key: string]: string
}

export function rowsToCsv(headers: string[], rows: string[][]): string {
  const lines = [headers, ...rows]
  return lines.map((l) => l.map(escapeCsv).join(';')).join('\r\n')
}

export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = '\uFEFF' + rowsToCsv(headers, rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
