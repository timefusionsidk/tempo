import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Plus, RotateCcw, Trash2, BellOff, Pencil, Check } from 'lucide-react'
import type { TimerItem } from '../types'
import { useTimers } from '../hooks/useTimers'
import { formatClock } from '../lib/time'
import CircularProgress from './CircularProgress'

function IconButton({
  label,
  onClick,
  children,
  variant = 'ghost'
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  variant?: 'ghost' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
        variant === 'danger'
          ? 'border-line text-ink-faint hover:border-red-300 hover:text-red-600 dark:border-line-dark dark:text-paper/40'
          : 'border-line text-ink-soft hover:border-signal hover:text-signal dark:border-line-dark dark:text-paper/70'
      }`}
    >
      {children}
    </button>
  )
}

export default function TimerCard({ timer }: { timer: TimerItem }) {
  const { getRemaining, startTimer, pauseTimer, resumeTimer, restartTimer, resetTimer, addTime, removeTimer, dismissCompleted, renameTimer } =
    useTimers()
  const remaining = getRemaining(timer)
  const progress = timer.durationMs > 0 ? 1 - remaining / timer.durationMs : 0

  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(timer.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const isRunning = timer.status === 'running'
  const isPaused = timer.status === 'paused'
  const isCompleted = timer.status === 'completed'
  const isIdle = timer.status === 'idle'

  function commitName() {
    renameTimer(timer.id, draftName || 'Timer')
    setEditing(false)
  }

  return (
    <div
      className={`rounded-3xl border p-6 shadow-card transition-colors ${
        isCompleted
          ? 'border-signal bg-signal/5 dark:border-signal-bright'
          : 'border-line bg-white/60 dark:border-line-dark dark:bg-surface-darkRaised'
      }`}
      role="group"
      aria-label={`Timer: ${timer.name}`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              commitName()
            }}
            className="flex flex-1 items-center gap-2"
          >
            <input
              ref={inputRef}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitName}
              maxLength={60}
              className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm dark:border-line-dark dark:bg-surface-dark"
              aria-label="Timer name"
            />
            <button type="submit" aria-label="Save name" className="text-signal">
              <Check className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraftName(timer.name)
              setEditing(true)
            }}
            className="group flex items-center gap-1.5 text-left text-base font-medium text-ink dark:text-paper"
          >
            {timer.name || 'Timer'}
            <Pencil className="h-3.5 w-3.5 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100 dark:text-paper/40" />
          </button>
        )}
        <IconButton label="Delete timer" onClick={() => removeTimer(timer.id)} variant="danger">
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="flex justify-center py-2">
        <CircularProgress progress={progress} size={220} tone={isCompleted ? 'complete' : 'default'}>
          <div className="text-center">
            <p
              className="font-tabular text-4xl font-medium tabular-nums text-ink dark:text-paper sm:text-5xl"
              aria-live="polite"
            >
              {formatClock(remaining, { forceHours: timer.durationMs >= 3_600_000 })}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint dark:text-paper/40">
              {isCompleted ? 'Done' : isPaused ? 'Paused' : isRunning ? 'Running' : 'Ready'}
            </p>
          </div>
        </CircularProgress>
      </div>

      {isCompleted ? (
        <div className="mt-2 flex flex-col items-center gap-3">
          <p className="text-sm text-ink-soft dark:text-paper/70">Time's up.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => dismissCompleted(timer.id)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper dark:bg-paper dark:text-surface-dark"
            >
              <BellOff className="h-4 w-4" /> Stop alert
            </button>
            <button
              type="button"
              onClick={() => restartTimer(timer.id)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink-soft dark:border-line-dark dark:text-paper/70"
            >
              <RotateCcw className="h-4 w-4" /> Run again
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {isRunning ? (
              <IconButton label="Pause" onClick={() => pauseTimer(timer.id)}>
                <Pause className="h-5 w-5" />
              </IconButton>
            ) : (
              <button
                type="button"
                onClick={() => (isPaused ? resumeTimer(timer.id) : startTimer(timer.id))}
                aria-label={isPaused ? 'Resume' : 'Start'}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-signal text-white shadow-card transition-colors hover:bg-signal-dim"
              >
                <Play className="ml-0.5 h-6 w-6" />
              </button>
            )}
            <IconButton label="Restart" onClick={() => restartTimer(timer.id)}>
              <RotateCcw className="h-5 w-5" />
            </IconButton>
            {!isIdle && (
              <IconButton label="Reset" onClick={() => resetTimer(timer.id)}>
                <span className="text-xs font-semibold">RST</span>
              </IconButton>
            )}
          </div>
          {(isRunning || isPaused) && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addTime(timer.id, 60_000)}
                className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-signal hover:text-signal dark:border-line-dark dark:text-paper/60"
              >
                <Plus className="h-3 w-3" /> 1 min
              </button>
              <button
                type="button"
                onClick={() => addTime(timer.id, 5 * 60_000)}
                className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-signal hover:text-signal dark:border-line-dark dark:text-paper/60"
              >
                <Plus className="h-3 w-3" /> 5 min
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
