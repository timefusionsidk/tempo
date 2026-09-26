interface Section {
  title: string
  body: React.ReactNode
}

const sections: Section[] = [
  {
    title: 'How the countdown stays accurate',
    body: (
      <p>
        When you start a timer, Tempo records the exact clock time it should end — not a count of ticks. That means
        pausing your phone, switching tabs, or letting the screen sleep doesn't throw the timer off: when you come
        back, Tempo compares the current time to that target and shows the true remaining time, even if a chunk of
        time passed while nothing was drawing on screen.
      </p>
    )
  },
  {
    title: 'How the stopwatch stays accurate',
    body: (
      <p>
        The stopwatch works the same way in reverse: it remembers the moment you pressed start and adds up elapsed
        time from that timestamp, rather than counting animation frames. Pausing stores the elapsed total; resuming
        starts a new segment from the current time. Laps record the elapsed total at the moment you tap the flag.
      </p>
    )
  },
  {
    title: 'What happens when a timer finishes in a background tab',
    body: (
      <p>
        Browsers slow down (throttle) inactive tabs to save battery, so Tempo may notice completion a little later
        than the exact second — usually within a second or two once the check runs again. The countdown itself
        doesn't drift, only how quickly Tempo can react and sound the alert. If you've allowed notifications, Tempo
        will also try to show one, though operating systems can delay or suppress notifications for backgrounded or
        fully closed browsers.
      </p>
    )
  },
  {
    title: 'Sound and notification limits, honestly',
    body: (
      <div className="space-y-2">
        <p>
          Tempo's alert sound plays through the browser tab that's running it. If that tab or the browser itself has
          been fully closed — not just backgrounded — no sound or notification can play; there's no way for a website
          to wake itself up after the browser process ends. Keep the tab open (it can be in the background) for the
          alert to fire.
        </p>
        <p>
          Some browsers also mute audio until you've interacted with the page at least once. Tempo asks for that
          interaction the moment you tap Start, which is usually enough to unlock sound for the rest of your visit.
        </p>
      </div>
    )
  },
  {
    title: 'Working offline',
    body: (
      <p>
        After your first visit, Tempo installs its app shell in your browser's cache, so the timer and stopwatch keep
        working with no connection. Nothing about your timers or sessions is ever sent anywhere to make this work —
        it's all read from and written to your own device.
      </p>
    )
  }
]

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">How Tempo works</h1>
      <p className="mt-2 text-ink-soft dark:text-paper/70">
        The short version: Tempo uses real clock timestamps instead of counting seconds, so it stays accurate even
        when your device or browser doesn't cooperate. Here's the fuller picture.
      </p>

      <div className="mt-10 space-y-9">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-xl text-ink dark:text-paper">{s.title}</h2>
            <div className="mt-2.5 text-[15px] leading-relaxed text-ink-soft dark:text-paper/70">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
