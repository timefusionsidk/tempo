const faqs: { q: string; a: string }[] = [
  {
    q: 'Is Tempo really free?',
    a: "Yes. There's no account, no subscription, and no feature paywall. An optional, clearly labelled ad may appear in informational areas of the site — never on the clock itself, and never blocking a Start, Pause, or Stop control."
  },
  {
    q: 'Do I need to create an account?',
    a: "No. Timers, presets, and settings are saved in your browser's local storage, tied to this device and this browser only."
  },
  {
    q: 'Will my timer keep running if I close the tab?',
    a: 'No — closing the tab or the browser stops Tempo from running, the same as any website. If you switch to another tab or lock your phone, the timer keeps counting against the clock and will show the correct remaining time when you return; see How it works for the details on background alerts.'
  },
  {
    q: 'Can I run more than one timer at a time?',
    a: 'Yes. Create as many named timers as you like from the Timer page — each has its own controls, progress ring, and alert.'
  },
  {
    q: "Why didn't I hear the alert sound?",
    a: "Most browsers block audio until you've interacted with the page. Tempo unlocks sound the moment you tap Start, so this is rare — but check that Tempo isn't muted in Settings, and that your device's silent switch or system volume isn't at zero."
  },
  {
    q: 'What data does Tempo collect?',
    a: 'None of your timer or stopwatch activity is sent to a server — see the Privacy Policy for the full picture, including what an ad provider may collect if ads are enabled.'
  },
  {
    q: 'Does Tempo work offline?',
    a: "Yes, once you've loaded it at least once. You can install it to your home screen or app list for quicker access."
  },
  {
    q: 'How do I clear my saved timers and settings?',
    a: "Open Settings and use \"Clear local data.\" This removes everything Tempo has stored in this browser and can't be undone."
  }
]

export default function FAQ() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">Frequently asked questions</h1>
      <div className="mt-8 divide-y divide-line dark:divide-line-dark">
        {faqs.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink dark:text-paper">
              {item.q}
              <span className="shrink-0 text-ink-faint transition-transform group-open:rotate-45 dark:text-paper/40" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft dark:text-paper/70">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
