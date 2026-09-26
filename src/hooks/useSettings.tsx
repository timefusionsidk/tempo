import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Settings, SoundId, ThemePreference } from '../types'
import { readJSON, writeJSON, STORAGE_KEYS, clearAllTempoData } from '../lib/storage'

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  sound: 'chime',
  volume: 0.7,
  reducedMotion: false,
  notificationsRequested: false
}

interface SettingsContextValue {
  settings: Settings
  setTheme: (theme: ThemePreference) => void
  setSound: (sound: SoundId) => void
  setVolume: (volume: number) => void
  setReducedMotion: (value: boolean) => void
  markNotificationsRequested: () => void
  resolvedTheme: 'light' | 'dark'
  prefersReducedMotionOS: boolean
  clearData: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersDark
}

function usePrefersReducedMotionOS() {
  const [prefers, setPrefers] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefers
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => readJSON(STORAGE_KEYS.settings, DEFAULT_SETTINGS))
  const prefersDarkOS = usePrefersDark()
  const prefersReducedMotionOS = usePrefersReducedMotionOS()

  useEffect(() => {
    writeJSON(STORAGE_KEYS.settings, settings)
  }, [settings])

  const resolvedTheme: 'light' | 'dark' =
    settings.theme === 'system' ? (prefersDarkOS ? 'dark' : 'light') : settings.theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  useEffect(() => {
    const root = document.documentElement
    const reduce = settings.reducedMotion || prefersReducedMotionOS
    root.classList.toggle('reduce-motion', reduce)
  }, [settings.reducedMotion, prefersReducedMotionOS])

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setSound: (sound) => setSettings((s) => ({ ...s, sound })),
      setVolume: (volume) => setSettings((s) => ({ ...s, volume: Math.max(0, Math.min(1, volume)) })),
      setReducedMotion: (reducedMotion) => setSettings((s) => ({ ...s, reducedMotion })),
      markNotificationsRequested: () => setSettings((s) => ({ ...s, notificationsRequested: true })),
      resolvedTheme,
      prefersReducedMotionOS,
      clearData: () => {
        clearAllTempoData()
        setSettings(DEFAULT_SETTINGS)
      }
    }),
    [settings, resolvedTheme, prefersReducedMotionOS]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
