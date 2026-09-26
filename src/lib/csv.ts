import type { Lap } from '../types'
import { formatClock } from './time'

export function lapsToCsv(laps: Lap[]): string {
  const header = 'Lap,Split,Total'
  const rows = laps.map(
    (lap) => `${lap.index},${formatClock(lap.lapMs, { showCentis: true })},${formatClock(lap.totalMs, { showCentis: true })}`
  )
  return [header, ...rows].join('\n')
}

export function lapsToText(laps: Lap[]): string {
  return laps
    .map((lap) => `Lap ${lap.index}  ·  Split ${formatClock(lap.lapMs, { showCentis: true })}  ·  Total ${formatClock(lap.totalMs, { showCentis: true })}`)
    .join('\n')
}

export function downloadTextFile(filename: string, content: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
