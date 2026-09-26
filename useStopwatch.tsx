import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Lap, StopwatchData } from '../types'
import { readJSON, writeJSON, STORAGE_KEYS } from '../lib/storage'
import { genId } from '../lib/id'
import { unlockAudio } from '../lib/sound'

const DEFAULT_STATE: StopwatchData = {
  status: 'idle',
  startAt: null,
  accumulatedMs: 0,
  laps: []
}

interface StopwatchContextValue {
  data: StopwatchData
  elapsedMs: number
  start: () => void
  pause: () => void
  reset: () => void
  lap: () => void
  hasMeaningfulSession: boolean
}

const StopwatchContext = createContext<StopwatchContextValue | null>(null)

export function StopwatchProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StopwatchData>(() => readJSON(STORAGE_KEYS.stopwatch, DEFAULT_STATE))
  const [elapsedMs, setElapsedMs] = useState<number>(() => {
    const d = readJSON(STORAGE_KEYS.stopwatch, DEFAULT_STATE)
    return d.status === 'running' && d.startAt ? d.accumulatedMs + (Date.now() - d.startAt) : d.accumulatedMs
  })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    writeJSON(STORAGE_KEYS.stopwatch, data)
  }, [data])

  useEffect(() => {
    if (data.status !== 'running' || data.startAt === null) {
      setElapsedMs(data.accumulatedMs)
      return
    }
    const startAt = data.startAt
    const accumulated = data.accumulatedMs
    const tick = () => {
      setElapsedMs(accumulated + (Date.now() - startAt))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [data.status, data.startAt, data.accumulatedMs])

  const start = useCallback(() => {
    unlockAudio()
    setData((d) => (d.status === 'running' ? d : { ...d, status: 'running', startAt: Date.now() }))
  }, [])

  const pause = useCallback(() => {
    setData((d) => {
      if (d.status !== 'running' || d.startAt === null) return d
      const accumulatedMs = d.accumulatedMs + (Date.now() - d.startAt)
      return { ...d, status: 'paused', startAt: null, accumulatedMs }
    })
  }, [])

  const reset = useCallback(() => {
    setData(DEFAULT_STATE)
    setElapsedMs(0)
  }, [])

  const lap = useCallback(() => {
    setData((d) => {
      const total = d.status === 'running' && d.startAt !== null ? d.accumulatedMs + (Date.now() - d.startAt) : d.accumulatedMs
      const previousTotal = d.laps.length > 0 ? d.laps[d.laps.length - 1].totalMs : 0
      const newLap: Lap = {
        id: genId(),
        index: d.laps.length + 1,
        lapMs: total - previousTotal,
        totalMs: total
      }
      return { ...d, laps: [...d.laps, newLap] }
    })
  }, [])

  const hasMeaningfulSession = data.status !== 'idle' || data.accumulatedMs > 0 || data.laps.length > 0

  const value = useMemo<StopwatchContextValue>(
    () => ({ data, elapsedMs, start, pause, reset, lap, hasMeaningfulSession }),
    [data, elapsedMs, start, pause, reset, lap, hasMeaningfulSession]
  )

  return <StopwatchContext.Provider value={value}>{children}</StopwatchContext.Provider>
}

export function useStopwatch() {
  const ctx = useContext(StopwatchContext)
  if (!ctx) throw new Error('useStopwatch must be used within StopwatchProvider')
  return ctx
}
