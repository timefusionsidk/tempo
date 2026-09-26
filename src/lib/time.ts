export function clampMs(ms: number): number {
  return Number.isFinite(ms) && ms > 0 ? Math.round(ms) : 0
}

interface FormatOptions {
  /** Always show the hours segment, even when it's 00. */
  forceHours?: boolean
  /** Include a hundredths-of-a-second segment. */
  showCentis?: boolean
}

/** Formats a millisecond duration as H:MM:SS, MM:SS, or with centiseconds. */
export function formatClock(ms: number, opts: FormatOptions = {}): string {
  const total = clampMs(ms)
  const hours = Math.floor(total / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  const centis = Math.floor((total % 1000) / 10)

  const pad = (n: number, width = 2) => n.toString().padStart(width, '0')

  const showHours = opts.forceHours || hours > 0
  const core = showHours
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`

  return opts.showCentis ? `${core}.${pad(centis)}` : core
}

/** Parses hours/minutes/seconds input fields into a millisecond duration. */
export function partsToMs(h: number, m: number, s: number): number {
  const safe = (n: number) => (Number.isFinite(n) && n > 0 ? Math.floor(n) : 0)
  return safe(h) * 3_600_000 + safe(m) * 60_000 + safe(s) * 1000
}

export function msToParts(ms: number): { h: number; m: number; s: number } {
  const total = clampMs(ms)
  return {
    h: Math.floor(total / 3_600_000),
    m: Math.floor((total % 3_600_000) / 60_000),
    s: Math.floor((total % 60_000) / 1000)
  }
}

export function formatMinutesLabel(ms: number): string {
  const mins = Math.round(ms / 60_000)
  return `${mins} min`
}
