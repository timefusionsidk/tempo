import StopwatchView from '../components/StopwatchView'
import AdSlot from '../components/AdSlot'

export default function StopwatchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">Stopwatch</h1>
      <p className="mt-1.5 max-w-lg text-ink-soft dark:text-paper/70">
        Precise to the hundredth of a second, with laps you can copy or export.
      </p>

      <div className="mt-10">
        <StopwatchView />
      </div>

      <div className="mt-16">
        <AdSlot placement="Stopwatch page — below laps" className="mx-auto max-w-2xl" />
      </div>
    </div>
  )
}
