import { useTimers } from '../hooks/useTimers'
import NewTimerForm from '../components/NewTimerForm'
import TimerCard from '../components/TimerCard'
import AdSlot from '../components/AdSlot'

export default function TimerPage() {
  const { timers } = useTimers()
  const active = [...timers].sort((a, b) => a.createdAt - b.createdAt)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">Timer</h1>
      <p className="mt-1.5 max-w-lg text-ink-soft dark:text-paper/70">
        Run as many timers as you need at once — each keeps its own name, progress, and alert.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <NewTimerForm />
        </div>

        <div>
          {active.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-line text-center text-sm text-ink-faint dark:border-line-dark dark:text-paper/40">
              No timers yet — set a duration to start your first one.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {active.map((t) => (
                <TimerCard key={t.id} timer={t} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <AdSlot placement="Timer page — below timers" className="mx-auto max-w-2xl" />
      </div>
    </div>
  )
}
