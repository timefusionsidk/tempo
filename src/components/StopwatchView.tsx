import { useEffect, useMemo, useState } from 'react'
import { Play, Pause, RotateCcw, Flag, Copy, Download, Check } from 'lucide-react'
import { useStopwatch } from '../hooks/useStopwatch'
import { formatClock } from '../lib/time'
import { lapsToCsv, lapsToText, downloadTextFile, copyToClipboard } from '../lib/csv'

export default function StopwatchView() {
  const { data, elapsedMs, start, pause, reset, lap, hasMeaningfulSession } = useStopwatch()
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [copied, setCopied] = useState(false)

  const isRunning = data.status === 'running'
  const isPaused = data.status === 'paused'

  const { fastestId, slowestId } = useMemo(() => {
    if (data.laps.length < 3) return { fastestId: null as string | null, slowestId: null as string | null }
    let fastest = data.laps[0]
    let slowest = data.laps[0]
    for (const l of data.laps) {
      if (l.lapMs < fastest.lapMs) fastest = l
      if (l.lapMs > slowest.lapMs) slowest = l
    }
    return { fastestId: fastest.id, slowestId: slowest.id }
  }, [data.laps])

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (typing) return
      if (e.code === 'Space') {
        e.preventDefault()
        isRunning ? pause() : start()
      } else if (e.key.toLowerCase() === 'l' && isRunning) {
        lap()
      } else if (e.key.toLowerCase() === 'r' && !isRunning) {
        if (hasMeaningfulSession) setConfirmingReset(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isRunning, pause, start, lap, hasMeaningfulSession])

  function handleResetClick() {
    if (hasMeaningfulSession) {
      setConfirmingReset(true)
    } else {
      reset()
    }
  }

  function confirmReset() {
    reset()
    setConfirmingReset(false)
  }

  async function handleCopy() {
    const ok = await copyToClipboard(lapsToText(data.laps))
    setCopied(ok)
    if (ok) setTimeout(() => setCopied(false), 1800)
  }

  function handleDownload() {
    downloadTextFile('tempo-laps.csv', lapsToCsv(data.laps))
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-8">
      <div className="text-center">
        <p className="font-tabular text-6xl font-medium tabular-nums text-ink dark:text-paper sm:text-7xl" aria-live="off">
          {formatClock(elapsedMs, { showCentis: true })}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide text-ink-faint dark:text-paper/40">
          {isRunning ? 'Running' : isPaused ? 'Paused' : 'Ready'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleResetClick}
          disabled={isRunning}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40 dark:border-line-dark dark:text-paper/70"
          aria-label="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => (isRunning ? pause() : start())}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal text-white shadow-card transition-colors hover:bg-signal-dim"
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
        </button>
        <button
          type="button"
          onClick={lap}
          disabled={!isRunning}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40 dark:border-line-dark dark:text-paper/70"
          aria-label="Lap"
        >
          <Flag className="h-5 w-5" />
        </button>
      </div>

      <p className="text-xs text-ink-faint dark:text-paper/40">
        Keyboard: <kbd className="rounded border border-line px-1 dark:border-line-dark">Space</kbd> start/pause ·{' '}
        <kbd className="rounded border border-line px-1 dark:border-line-dark">L</kbd> lap ·{' '}
        <kbd className="rounded border border-line px-1 dark:border-line-dark">R</kbd> reset
      </p>

      {confirmingReset && (
        <div role="alertdialog" aria-label="Confirm reset" className="w-full rounded-2xl border border-signal bg-signal/5 p-4 text-center">
          <p className="text-sm text-ink dark:text-paper">Clear this session and its {data.laps.length} lap{data.laps.length === 1 ? '' : 's'}?</p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={confirmReset}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper dark:bg-paper dark:text-surface-dark"
            >
              Clear session
            </button>
            <button
              type="button"
              onClick={() => setConfirmingReset(false)}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft dark:border-line-dark dark:text-paper/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {data.laps.length > 0 && (
        <div className="w-full rounded-3xl border border-line bg-white/60 shadow-card dark:border-line-dark dark:bg-surface-darkRaised">
          <div className="flex items-center justify-between border-b border-line px-5 py-3 dark:border-line-dark">
            <h2 className="text-sm font-medium text-ink dark:text-paper">Laps</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-ink-faint hover:bg-ink/5 dark:text-paper/50 dark:hover:bg-paper/10"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs text-ink-faint hover:bg-ink/5 dark:text-paper/50 dark:hover:bg-paper/10"
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
          </div>
          <ul className="max-h-80 overflow-y-auto scrollbar-thin">
            {[...data.laps].reverse().map((l) => (
              <li
                key={l.id}
                className={`flex items-center justify-between px-5 py-2.5 text-sm font-tabular tabular-nums ${
                  l.id === fastestId
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : l.id === slowestId
                      ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                      : 'text-ink-soft dark:text-paper/70'
                }`}
              >
                <span>Lap {l.index}</span>
                <span>{formatClock(l.lapMs, { showCentis: true })}</span>
                <span className="text-ink-faint dark:text-paper/40">{formatClock(l.totalMs, { showCentis: true })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
