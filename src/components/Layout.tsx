import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { Menu, X, Settings as SettingsIcon, TimerIcon, Watch } from 'lucide-react'
import Logo from './Logo'
import { useTimers } from '../hooks/useTimers'
import { useStopwatch } from '../hooks/useStopwatch'

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
    </span>
  )
}

function NavItem({
  to,
  label,
  icon,
  live
}: {
  to: string
  label: string
  icon: React.ReactNode
  live?: boolean
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-ink text-paper dark:bg-paper dark:text-surface-dark'
            : 'text-ink-soft hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10'
        }`
      }
    >
      {icon}
      {label}
      {live && <LiveDot />}
    </NavLink>
  )
}

const infoLinks = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/faq', label: 'FAQ' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' }
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { timers } = useTimers()
  const { data: stopwatchData } = useStopwatch()

  const timerLive = timers.some((t) => t.status === 'running' || t.status === 'completed')
  const stopwatchLive = stopwatchData.status === 'running' || stopwatchData.status === 'paused'

  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur dark:border-line-dark dark:bg-surface-dark/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Tempo home">
            <Logo size={30} />
            <span className="font-display text-lg font-medium tracking-tight">Tempo</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <NavItem to="/timer" label="Timer" icon={<TimerIcon className="h-4 w-4" />} live={timerLive} />
            <NavItem to="/stopwatch" label="Stopwatch" icon={<Watch className="h-4 w-4" />} live={stopwatchLive} />
            <span className="mx-1 h-5 w-px bg-line dark:bg-line-dark" aria-hidden="true" />
            {infoLinks.slice(0, 2).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-ink dark:text-paper'
                      : 'text-ink-faint hover:text-ink dark:text-paper/50 dark:hover:text-paper'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/settings"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10"
              aria-label="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10 md:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-line px-4 py-3 dark:border-line-dark md:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              <NavItem to="/timer" label="Timer" icon={<TimerIcon className="h-4 w-4" />} live={timerLive} />
              <NavItem to="/stopwatch" label="Stopwatch" icon={<Watch className="h-4 w-4" />} live={stopwatchLive} />
              {infoLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-paper/10"
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line dark:border-line-dark">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <Link to="/" className="flex items-center gap-2">
                <Logo size={22} />
                <span className="font-display text-base font-medium">Tempo</span>
              </Link>
              <p className="mt-3 text-sm text-ink-faint dark:text-paper/50">
                A free timer and stopwatch that keeps time on your device — no account, no tracking of your sessions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
              <div>
                <p className="font-medium text-ink dark:text-paper">Tools</p>
                <ul className="mt-3 space-y-2 text-ink-faint dark:text-paper/50">
                  <li><Link to="/timer" className="hover:text-ink dark:hover:text-paper">Timer</Link></li>
                  <li><Link to="/stopwatch" className="hover:text-ink dark:hover:text-paper">Stopwatch</Link></li>
                  <li><Link to="/settings" className="hover:text-ink dark:hover:text-paper">Settings</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-ink dark:text-paper">Resources</p>
                <ul className="mt-3 space-y-2 text-ink-faint dark:text-paper/50">
                  <li><Link to="/how-it-works" className="hover:text-ink dark:hover:text-paper">How it works</Link></li>
                  <li><Link to="/faq" className="hover:text-ink dark:hover:text-paper">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-ink dark:text-paper">Legal</p>
                <ul className="mt-3 space-y-2 text-ink-faint dark:text-paper/50">
                  <li><Link to="/privacy" className="hover:text-ink dark:hover:text-paper">Privacy</Link></li>
                  <li><Link to="/terms" className="hover:text-ink dark:hover:text-paper">Terms</Link></li>
                  <li><a href="mailto:hello@tempo.example.com" className="hover:text-ink dark:hover:text-paper">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-10 text-xs text-ink-faint dark:text-paper/40">© {new Date().getFullYear()} Tempo. Built as a small, focused utility.</p>
        </div>
      </footer>
    </div>
  )
}
