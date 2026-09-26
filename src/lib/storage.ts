/**
 * Every read/write is wrapped so a private-browsing quota error or disabled
 * storage never crashes the app — Tempo just falls back to in-memory state
 * for that session.
 */

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  timers: 'tempo:timers:v1',
  presets: 'tempo:presets:v1',
  settings: 'tempo:settings:v1',
  stopwatch: 'tempo:stopwatch:v1'
} as const

/** Clears everything Tempo has stored in this browser. Used by Settings > Clear data. */
export function clearAllTempoData() {
  Object.values(STORAGE_KEYS).forEach(removeKey)
}
