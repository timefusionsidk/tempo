export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-faint dark:text-paper/40">Last updated September 2026</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-ink-soft dark:text-paper/70">
        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">What Tempo stores</h2>
          <p className="mt-2">
            Tempo saves the following in your browser's local storage, on your device only: the timers you create and
            their names and durations, your custom presets, your stopwatch session and laps, and your settings
            (theme, sound, volume, reduced-motion, and whether you've responded to a notification prompt). None of
            this is transmitted to Tempo or to any server we operate. There is no account and no database — if you
            clear your browser's site data, or use a different browser or device, this information is gone.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Notifications</h2>
          <p className="mt-2">
            If you choose to enable browser notifications, Tempo asks your browser to show a system notification when
            a timer finishes. That permission and the notification itself are handled entirely by your browser and
            operating system — Tempo does not receive any data back from it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Advertising</h2>
          <p className="mt-2">
            Tempo can optionally display ads served by a third-party ad network (such as Google AdSense) in
            informational areas of the site. When ads are enabled, the ad provider may use cookies, device
            identifiers, or similar technology to select and measure ads, and this may involve processing some
            information about your visit under its own privacy policy. If no ad publisher and slot are configured for
            a given deployment of Tempo, no ad script loads and no such data is collected. We do not claim Tempo
            collects zero data in deployments where ads are enabled — this section exists to be accurate about that.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Analytics</h2>
          <p className="mt-2">
            Tempo's core app does not run its own analytics or tracking scripts. A deployment may add standard,
            privacy-respecting hosting logs at the server level (such as those any web host keeps), which are
            separate from anything the app itself does.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Your choices</h2>
          <p className="mt-2">
            You can clear everything Tempo has stored at any time from Settings → Clear local data, or by clearing
            this site's data in your browser settings directly.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to{' '}
            <a href="mailto:hello@tempo.example.com" className="text-signal underline underline-offset-2">
              hello@tempo.example.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
