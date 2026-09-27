export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight text-ink dark:text-paper">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink-faint dark:text-paper/40">Last updated September 2026</p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-ink-soft dark:text-paper/70">
        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Using Tempo</h2>
          <p className="mt-2">
            Tempo is provided free of charge, without an account or subscription. You may use it for personal or
            professional timing needs, on any device with a supported browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">No warranty</h2>
          <p className="mt-2">
            Tempo is provided "as is," without warranties of any kind. In particular, we do not guarantee that alerts,
            sounds, or notifications will fire at the exact intended moment, or at all, in every browser, device, or
            operating-system state — see How it works for the specific limitations around background tabs, closed
            browsers, and system notification settings. Do not rely on Tempo for safety-critical timing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Tempo's operators are not liable for any loss or damage arising
            from your use of, or inability to use, the app — including a missed or late alert.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Advertising</h2>
          <p className="mt-2">
            Where enabled, ads are supplied by a third-party network and are subject to that network's own terms. See
            the Privacy Policy for what this may involve.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Changes</h2>
          <p className="mt-2">
            We may update these terms as Tempo changes. Continued use after an update means you accept the revised
            terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink dark:text-paper">Contact</h2>
          <p className="mt-2">
            Questions can be sent through the <a href="/contact" className="text-signal underline underline-offset-2">Contact page</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
