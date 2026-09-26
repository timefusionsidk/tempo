import { useNavigate } from 'react-router-dom'
import { TimerIcon, Watch, ShieldCheck, WifiOff } from 'lucide-react'
import NewTimerForm from '../components/NewTimerForm'
import AdSlot from '../components/AdSlot'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-16">
        <div className="animate-fade-up">
          <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-ink dark:text-paper sm:text-5xl lg:text-[3.4rem]">
            Time, kept honestly.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft dark:text-paper/70">
            Set a countdown or start the stopwatch. Tempo runs on your device, keeps going when the tab is hidden, and
            works without a connection — no account required.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/timer')}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-signal-dim"
            >
              <TimerIcon className="h-4 w-4" /> Open the timer
            </button>
            <button
              type="button"
              onClick={() => navigate('/stopwatch')}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-signal hover:text-signal dark:border-line-dark dark:text-paper/70"
            >
              <Watch className="h-4 w-4" /> Open the stopwatch
            </button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 dark:border-line-dark">
            <div className="flex items-start gap-2.5">
              <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <div>
                <dt className="text-sm font-medium text-ink dark:text-paper">Works offline</dt>
                <dd className="text-sm text-ink-faint dark:text-paper/40">After your first visit, no connection needed.</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <div>
                <dt className="text-sm font-medium text-ink dark:text-paper">Stays on your device</dt>
                <dd className="text-sm text-ink-faint dark:text-paper/40">Timers and settings live in your browser only.</dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="animate-fade-up [animation-delay:80ms]">
          <p className="mb-3 text-sm font-medium text-ink-soft dark:text-paper/70">Start a timer now</p>
          <NewTimerForm onStarted={() => navigate('/timer')} />
        </div>
      </div>

      <div className="mt-16">
        <AdSlot placement="Home — below the fold" className="mx-auto max-w-2xl" />
      </div>
    </div>
  )
}
