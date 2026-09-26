import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Preset, TimerItem } from '../types'
import { readJSON, writeJSON, STORAGE_KEYS } from '../lib/storage'
import { genId } from '../lib/id'
import { clampMs } from '../lib/time'
import { useSettings } from './useSettings'
import { startAlertLoop, unlockAudio } from '../lib/sound'
import { notify } from '../lib/notifications'

const TICK_MS = 250

function reconcileOnLoad(timers: TimerItem[]): TimerItem[] {
  const now = Date.now()
  return timers.map((t) => {
    if (t.status === 'running' && t.endAt !== null) {
      const remaining = t.endAt - now
      if (remaining <= 0) {
        return { ...t, status: 'completed', remainingMs: 0, endAt: null }
      }
      return { ...t, remainingMs: remaining }
    }
    return t
  })
}

interface TimersContextValue {
  timers: TimerItem[]
  presets: Preset[]
  createTimer: (name: string, durationMs: number) => string
  startTimer: (id: string) => void
  pauseTimer: (id: string) => void
  resumeTimer: (id: string) => void
  restartTimer: (id: string) => void
  resetTimer: (id: string) => void
  addTime: (id: string, ms: number) => void
  removeTimer: (id: string) => void
  dismissCompleted: (id: string) => void
  renameTimer: (id: string, name: string) => void
  savePreset: (label: string, ms: number) => void
  removePreset: (id: string) => void
  getRemaining: (timer: TimerItem) => number
}

const TimersContext = createContext<TimersContextValue | null>(null)

export function TimersProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const [timers, setTimers] = useState<TimerItem[]>(() => reconcileOnLoad(readJSON(STORAGE_KEYS.timers, [])))
  const [presets, setPresets] = useState<Preset[]>(() => readJSON(STORAGE_KEYS.presets, []))
  const [now, setNow] = useState(() => Date.now())
  const alertStopFns = useRef<Map<string, () => void>>(new Map())
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    writeJSON(STORAGE_KEYS.timers, timers)
  }, [timers])

  useEffect(() => {
    writeJSON(STORAGE_KEYS.presets, presets)
  }, [presets])

  const fireCompletion = useCallback((timer: TimerItem) => {
    const s = settingsRef.current
    const stop = startAlertLoop(s.sound, s.volume)
    alertStopFns.current.set(timer.id, stop)
    notify('Time’s up', timer.name ? `“${timer.name}” has finished.` : 'Your timer has finished.')
  }, [])

  // Single shared interval drives every running timer — no per-timer setInterval drift.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now()
      setTimers((prev) => {
        let changed = false
        const next = prev.map((t) => {
          if (t.status !== 'running' || t.endAt === null) return t
          const remaining = t.endAt - now
          if (remaining <= 0) {
            changed = true
            fireCompletion(t)
            return { ...t, status: 'completed' as const, remainingMs: 0, endAt: null }
          }
          return t
        })
        return changed ? next : prev
      })
      setNow(now)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [fireCompletion])

  const getRemaining = useCallback(
    (timer: TimerItem): number => {
      if (timer.status === 'running' && timer.endAt !== null) {
        return clampMs(timer.endAt - now)
      }
      return timer.remainingMs
    },
    [now]
  )

  const createTimer = useCallback((name: string, durationMs: number) => {
    const id = genId()
    const item: TimerItem = {
      id,
      name: name.trim(),
      durationMs: clampMs(durationMs) || 60_000,
      remainingMs: clampMs(durationMs) || 60_000,
      endAt: null,
      status: 'idle',
      createdAt: Date.now()
    }
    setTimers((prev) => [...prev, item])
    return id
  }, [])

  const startTimer = useCallback((id: string) => {
    unlockAudio()
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id && (t.status === 'idle' || t.status === 'paused')
          ? { ...t, status: 'running', endAt: Date.now() + (t.remainingMs || t.durationMs) }
          : t
      )
    )
  }, [])

  const pauseTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.status !== 'running' || t.endAt === null) return t
        return { ...t, status: 'paused', remainingMs: clampMs(t.endAt - Date.now()), endAt: null }
      })
    )
  }, [])

  const resumeTimer = useCallback(
    (id: string) => {
      startTimer(id)
    },
    [startTimer]
  )

  const restartTimer = useCallback((id: string) => {
    unlockAudio()
    const stop = alertStopFns.current.get(id)
    if (stop) {
      stop()
      alertStopFns.current.delete(id)
    }
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'running', remainingMs: t.durationMs, endAt: Date.now() + t.durationMs } : t))
    )
  }, [])

  const resetTimer = useCallback((id: string) => {
    const stop = alertStopFns.current.get(id)
    if (stop) {
      stop()
      alertStopFns.current.delete(id)
    }
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'idle', remainingMs: t.durationMs, endAt: null } : t)))
  }, [])

  const addTime = useCallback((id: string, ms: number) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        if (t.status === 'running' && t.endAt !== null) {
          return { ...t, endAt: t.endAt + ms, durationMs: t.durationMs + ms }
        }
        if (t.status === 'completed') {
          // Bringing a finished timer back with more time restarts its run.
          const stop = alertStopFns.current.get(id)
          if (stop) {
            stop()
            alertStopFns.current.delete(id)
          }
          return { ...t, status: 'running', durationMs: t.durationMs + ms, remainingMs: ms, endAt: Date.now() + ms }
        }
        return { ...t, durationMs: t.durationMs + ms, remainingMs: t.remainingMs + ms }
      })
    )
  }, [])

  const removeTimer = useCallback((id: string) => {
    const stop = alertStopFns.current.get(id)
    if (stop) {
      stop()
      alertStopFns.current.delete(id)
    }
    setTimers((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissCompleted = useCallback((id: string) => {
    const stop = alertStopFns.current.get(id)
    if (stop) {
      stop()
      alertStopFns.current.delete(id)
    }
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'idle', remainingMs: t.durationMs, endAt: null } : t)))
  }, [])

  const renameTimer = useCallback((id: string, name: string) => {
    setTimers((prev) => prev.map((t) => (t.id === id ? { ...t, name: name.trim() } : t)))
  }, [])

  const savePreset = useCallback((label: string, ms: number) => {
    setPresets((prev) => [...prev, { id: genId(), label: label.trim() || `${Math.round(ms / 60_000)} min`, ms }])
  }, [])

  const removePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // Stop any lingering alert loops on unmount (route/provider teardown, e.g. HMR).
  useEffect(() => {
    const fns = alertStopFns.current
    return () => fns.forEach((stop) => stop())
  }, [])

  const value = useMemo<TimersContextValue>(
    () => ({
      timers,
      presets,
      createTimer,
      startTimer,
      pauseTimer,
      resumeTimer,
      restartTimer,
      resetTimer,
      addTime,
      removeTimer,
      dismissCompleted,
      renameTimer,
      savePreset,
      removePreset,
      getRemaining
    }),
    [
      timers,
      presets,
      createTimer,
      startTimer,
      pauseTimer,
      resumeTimer,
      restartTimer,
      resetTimer,
      addTime,
      removeTimer,
      dismissCompleted,
      renameTimer,
      savePreset,
      removePreset,
      getRemaining
    ]
  )

  return <TimersContext.Provider value={value}>{children}</TimersContext.Provider>
}

export function useTimers() {
  const ctx = useContext(TimersContext)
  if (!ctx) throw new Error('useTimers must be used within TimersProvider')
  return ctx
}
