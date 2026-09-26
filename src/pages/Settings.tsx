import { useState } from 'react'
import { Bell, BellOff, Trash2, Volume2, VolumeX, Sun, Moon, Monitor } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { getNotificationState, requestNotificationPermission } from '../lib/notifications'
import { playAlert, unlockAudio, SOUND_LABELS } from '../lib/sound'
import type { SoundId, ThemePreference } from '../types'

const SOUND_OPTIONS: SoundId[] = ['chime', 'bell', 'digital', 'soft', 'none']

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> }
]

export default function Settings() {
  const { settings, setTheme, setSound, setVolume, setReducedMotion, markNotificationsRequested, clearData } = useSettings()
  const [notifState, setNotifState] = useState(getNotificationState())
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [cleared, setCleared] = useState(false)

  async function handleEnableNotifications() {
    markNotificationsRequested()
    const result = await requestNotificationPermission()
    setNotifState(result)
  }

  function handlePreview(sound: SoundId) {
    unlockAudio()
    playAlert(sound, settings.volume)
  }

  function handleClear() {
    clearData()
    setConfirmingClear(false)
    setCleared(true)
    setTimeout(() => setCleared(false), 2500)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">Settings</h1>
      <p className="mt-2 text-ink-soft dark:text-paper/70">Stored on this device only.</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-faint dark:text-paper/40">Appearance</h2>
          <div className="mt-3 inline-flex rounded-full border border-line p-1 dark:border-line-dark">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                aria-pressed={settings.theme === opt.value}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  settings.theme === opt.value
                    ? 'bg-ink text-paper dark:bg-paper dark:text-surface-dark'
                    : 'text-ink-soft dark:text-paper/60'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-faint dark:text-paper/40">Alert sound</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SOUND_OPTIONS.map((id) => (
              <div key={id} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSound(id)}
                  aria-pressed={settings.sound === id}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    settings.sound === id
                      ? 'border-signal bg-signal/5 text-signal'
                      : 'border-line text-ink-soft dark:border-line-dark dark:text-paper/60'
                  }`}
                >
                  {SOUND_LABELS[id]}
                </button>
                {id !== 'none' && (
                  <button
                    type="button"
                    onClick={() => handlePreview(id)}
                    aria-label={`Preview ${SOUND_LABELS[id]} sound`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:text-signal dark:border-line-dark dark:text-paper/40"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            {settings.volume === 0 ? (
              <VolumeX className="h-4 w-4 text-ink-faint dark:text-paper/40" />
            ) : (
              <Volume2 className="h-4 w-4 text-ink-faint dark:text-paper/40" />
            )}
            <label htmlFor="volume" className="sr-only">
              Alert volume
            </label>
            <input
              id="volume"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-signal"
            />
            <span className="w-10 shrink-0 text-right text-sm font-tabular text-ink-faint dark:text-paper/40">
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-faint dark:text-paper/40">Motion</h2>
          <label className="mt-3 flex items-center justify-between rounded-2xl border border-line p-4 dark:border-line-dark">
            <span>
              <span className="block text-sm font-medium text-ink dark:text-paper">Reduce motion</span>
              <span className="block text-sm text-ink-faint dark:text-paper/40">
                Turns off progress-ring transitions and other animation, beyond your system setting.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="h-5 w-5 accent-signal"
            />
          </label>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-faint dark:text-paper/40">Notifications</h2>
          <div className="mt-3 rounded-2xl border border-line p-4 dark:border-line-dark">
            {notifState === 'unsupported' && (
              <p className="text-sm text-ink-faint dark:text-paper/40">Your browser doesn't support notifications.</p>
            )}
            {notifState === 'granted' && (
              <p className="flex items-center gap-2 text-sm text-ink-soft dark:text-paper/70">
                <Bell className="h-4 w-4 text-signal" /> Notifications are enabled for finished timers.
              </p>
            )}
            {notifState === 'denied' && (
              <p className="flex items-center gap-2 text-sm text-ink-faint dark:text-paper/40">
                <BellOff className="h-4 w-4" /> Notifications are blocked. Allow them from your browser's site
                settings to enable.
              </p>
            )}
            {notifState === 'default' && (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-ink-soft dark:text-paper/70">
                  Get a system notification when a timer finishes, even if you're on another tab.
                </p>
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="shrink-0 rounded-full bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-dim"
                >
                  Enable
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium uppercase tracking-wide text-ink-faint dark:text-paper/40">Your data</h2>
          <div className="mt-3 rounded-2xl border border-line p-4 dark:border-line-dark">
            <p className="text-sm text-ink-soft dark:text-paper/70">
              Remove every timer, preset, stopwatch session, and setting Tempo has saved in this browser.
            </p>
            {confirmingClear ? (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Yes, clear everything
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingClear(false)}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft dark:border-line-dark dark:text-paper/70"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-red-300 hover:text-red-600 dark:border-line-dark dark:text-paper/70"
              >
                <Trash2 className="h-4 w-4" /> Clear local data
              </button>
            )}
            {cleared && <p className="mt-2 text-sm text-signal">Done — all local data cleared.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
