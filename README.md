# Tempo — Timer & Stopwatch

A free, private, installable timer and stopwatch. No login, no backend, no
tracking of your sessions — everything runs and stays in your browser.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- `vite-plugin-pwa` (offline support, installable app, service worker)
- Lucide icons
- Zero backend. Zero required environment variables.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Building and previewing

```bash
npm run build      # type-checks with tsc, then builds with Vite into dist/
npm run preview    # serves the production build locally
```

## Deploying to Vercel

1. Push this project to a Git repository.
2. Import it in Vercel — the defaults (Vite framework preset) work as-is;
   `vercel.json` is already included for SPA routing and asset caching.
3. Set `VITE_SITE_URL` to your real domain (in Vercel's dashboard, or by
   editing `.env`) — it's used for the canonical link and Open Graph tags.
   Also update the domain in `public/robots.txt` and `public/sitemap.xml`,
   which are static files Vite copies as-is rather than templating.
4. Optionally set the ad environment variables from `.env.example` (see
   "Ads" below). None are required for the app to work.

## Project structure

```
src/
  components/     UI building blocks (Layout, TimerCard, StopwatchView, AdSlot, ...)
  hooks/           React context + hooks: settings, timers engine, stopwatch engine
  lib/             Pure helpers: time formatting, storage, synthesized sounds,
                   notifications, CSV export, ids, presets
  pages/           One file per route (Home, TimerPage, StopwatchPage, FAQ, ...)
  types.ts         Shared TypeScript types
public/
  icons/           App icons (192, 512, maskable 512) — regenerate with
                   `python3 scripts/gen_icons.py` if you want a different design
  favicon.svg, robots.txt, sitemap.xml
```

## How timing accuracy works

Timers store the **wall-clock timestamp** they should end at (`Date.now() +
duration`), not a countdown of ticks. A single shared interval recomputes
`remaining = endAt - Date.now()` for every running timer, so pausing the
tab, letting the device sleep, or refreshing the page never causes drift —
only how quickly Tempo can notice and alert you once a timer has actually
reached zero. The stopwatch works the same way in reverse, accumulating
elapsed time from timestamps rather than counting animation frames. See the
in-app "How it works" page for the full explanation, including the honest
limits around closed tabs/browsers and OS-level notification throttling.

## Sounds

Alert sounds (Chime, Bell, Digital, Soft) are synthesized at runtime with
the Web Audio API — there are no audio files to ship, license, or fail to
cache offline.

## Ads (optional, disabled by default)

Tempo ships an `AdSlot` component that:

- Renders **nothing** in production unless both `VITE_AD_CLIENT_ID` and
  `VITE_AD_SLOT_ID` are set.
- Renders a clearly labelled placeholder in development when unset, so you
  can review layout.
- Is never placed between the user and a Start/Pause/Stop/Reset control.

Copy `.env.example` to `.env` and fill in real IDs to enable ads; leave it
blank to keep Tempo ad-free.

## What's been verified vs. not

**Build-verified in this environment:**
- `tsc -b` type-checks clean across the whole project
- `vite build` produces a working production bundle, including the
  generated service worker and manifest
- `vite preview` serves the built app and returns the app shell

**Not verified here (no real browser/device available in this
environment) — please check these after deploying:**
- Actual audible playback of the synthesized alert sounds
- Real notification prompts/permission UI and delivery
- Backgrounded-tab / device-sleep timing behavior on a phone
- Installability prompts and offline behavior after airplane mode
- Screen reader announcement behavior (`aria-live` regions are in place
  on the timer and completion states, but a real screen reader pass is
  worth doing)
- Visual review on real devices at narrow widths (320px) and with
  `prefers-reduced-motion` / dark mode toggled at the OS level

None of these gaps are logic issues in the code — they're things that can
only really be confirmed by opening the deployed app in an actual browser.
