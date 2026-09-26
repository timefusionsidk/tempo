import { useMemo, useState } from 'react'
import { Plus, Star, X } from 'lucide-react'
import { useTimers } from '../hooks/useTimers'
import { BUILT_IN_PRESETS } from '../lib/presets'
import { partsToMs, msToParts, formatMinutesLabel } from '../lib/time'

export default function NewTimerForm({ onStarted }: { onStarted?: () => void } = {}) {
  const { createTimer, startTimer, presets, savePreset, removePreset } = useTimers()
  const [name, setName] = useState('')
  const [h, setH] = useState(0)
  const [m, setM] = useState(5)
  const [s, setS] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const durationMs = useMemo(() => partsToMs(h, m, s), [h, m, s])
  const allPresets = [...BUILT_IN_PRESETS, ...presets]

  function applyPreset(ms: number) {
    const parts = msToParts(ms)
    setH(parts.h)
    setM(parts.m)
    setS(parts.s)
    setError(null)
  }

  function handleField(setter: (n: number) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const n = raw === '' ? 0 : Math.max(0, Math.floor(Number(raw)))
      setter(Number.isFinite(n) ? n : 0)
      setError(null)
    }
  }

  function handleCreateAndStart() {
    if (durationMs <= 0) {
      setError('Set a duration greater than zero.')
      return
    }
    const id = createTimer(name || 'Timer', durationMs)
    startTimer(id)
    setName('')
    onStarted?.()
  }

  function handleSavePreset() {
    if (durationMs <= 0) {
      setError('Set a duration greater than zero before saving it as a preset.')
      return
    }
    savePreset(name ? name : formatMinutesLabel(durationMs), durationMs)
  }

  return (
    <div className="rounded-3xl border border-line bg-white/60 p-5 shadow-card dark:border-line-dark dark:bg-surface-darkRaised sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="timer-name" className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-paper/70">
            Name <span className="text-ink-faint dark:text-paper/40">(optional)</span>
          </label>
          <input
            id="timer-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pasta, Focus block, Tea steep"
            maxLength={60}
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-signal dark:border-line-dark dark:bg-surface-dark dark:text-paper dark:placeholder:text-paper/30"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-paper/70">Duration</span>
          <div className="flex items-center gap-2">
            {[
              { label: 'Hours', value: h, setter: setH, max: 23 },
              { label: 'Minutes', value: m, setter: setM, max: 59 },
              { label: 'Seconds', value: s, setter: setS, max: 59 }
            ].map((field) => (
              <div key={field.label} className="flex-1">
                <label htmlFor={`timer-${field.label}`} className="sr-only">
                  {field.label}
                </label>
                <input
                  id={`timer-${field.label}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={field.max}
                  value={field.value}
                  onChange={handleField(field.setter)}
                  className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-center font-tabular text-lg text-ink focus-visible:border-signal dark:border-line-dark dark:bg-surface-dark dark:text-paper"
                />
                <p className="mt-1 text-center text-[11px] text-ink-faint dark:text-paper/40">{field.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-soft dark:text-paper/70">Presets</span>
          <div className="flex flex-wrap gap-2">
            {allPresets.map((p) => {
              const isCustom = !p.id.startsWith('builtin-')
              return (
                <span key={p.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => applyPreset(p.ms)}
                    className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:border-signal hover:text-signal dark:border-line-dark dark:bg-surface-dark dark:text-paper/70"
                  >
                    {p.label}
                  </button>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => removePreset(p.id)}
                      aria-label={`Remove preset ${p.label}`}
                      className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-ink text-paper group-hover:flex group-focus-within:flex dark:bg-paper dark:text-surface-dark"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              )
            })}
            <button
              type="button"
              onClick={handleSavePreset}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-line px-3.5 py-1.5 text-sm text-ink-faint transition-colors hover:border-signal hover:text-signal dark:border-line-dark dark:text-paper/40"
            >
              <Star className="h-3.5 w-3.5" /> Save as preset
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCreateAndStart}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-dim focus-visible:outline-offset-4"
        >
          <Plus className="h-4 w-4" /> Start timer
        </button>
      </div>
    </div>
  )
}
