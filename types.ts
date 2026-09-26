export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerItem {
  id: string
  name: string
  /** Original duration in milliseconds. Used to restart and to compute progress. */
  durationMs: number
  /** Milliseconds remaining. Authoritative while paused, idle, or completed. */
  remainingMs: number
  /** Epoch ms the timer will (or did) reach zero. Set only while running. */
  endAt: number | null
  status: TimerStatus
  createdAt: number
}

export interface Preset {
  id: string
  label: string
  ms: number
}

export type SoundId = 'chime' | 'bell' | 'digital' | 'soft' | 'none'

export type ThemePreference = 'light' | 'dark' | 'system'

export type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

export interface Settings {
  theme: ThemePreference
  sound: SoundId
  volume: number
  reducedMotion: boolean
  notificationsRequested: boolean
}

export interface Lap {
  id: string
  index: number
  lapMs: number
  totalMs: number
}

export type StopwatchStatus = 'idle' | 'running' | 'paused'

export interface StopwatchData {
  status: StopwatchStatus
  startAt: number | null
  accumulatedMs: number
  laps: Lap[]
}
