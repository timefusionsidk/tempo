import { useEffect, useRef, useState } from 'react'

interface AdSlotProps {
  /** A short label used only for the dev placeholder, e.g. "In-article". */
  placement: string
  className?: string
}

const CLIENT_ID = import.meta.env.VITE_AD_CLIENT_ID
const SLOT_ID = import.meta.env.VITE_AD_SLOT_ID
const ADS_CONFIGURED = Boolean(CLIENT_ID && SLOT_ID)

let scriptLoadPromise: Promise<void> | null = null

function loadAdScript(clientId: string): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise
  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-tempo-ads]')
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
    script.async = true
    script.crossOrigin = 'anonymous'
    script.dataset.tempoAds = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Ad script failed to load'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

/**
 * Renders a real ad only when both VITE_AD_CLIENT_ID and VITE_AD_SLOT_ID are
 * set. Otherwise it shows nothing in production, or a clearly labelled
 * placeholder in development so the layout can be reviewed. Never placed
 * between the user and a Start/Pause/Stop/Reset control.
 */
export default function AdSlot({ placement, className = '' }: AdSlotProps) {
  const ref = useRef<HTMLModElement | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!ADS_CONFIGURED) return
    loadAdScript(CLIENT_ID)
      .then(() => {
        try {
          ;(window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []
          ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({})
        } catch {
          setFailed(true)
        }
      })
      .catch(() => setFailed(true))
  }, [])

  if (!ADS_CONFIGURED) {
    if (import.meta.env.PROD) return null
    return (
      <div
        className={`flex min-h-[90px] items-center justify-center rounded-2xl border border-dashed border-line bg-paper-dim text-xs text-ink-faint dark:border-line-dark dark:bg-surface-darkRaised dark:text-paper/40 ${className}`}
        aria-hidden="true"
      >
        Ad placeholder — {placement} (not shown in production until VITE_AD_CLIENT_ID / VITE_AD_SLOT_ID are set)
      </div>
    )
  }

  if (failed) return null

  return (
    <div className={className}>
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-ink-faint dark:text-paper/40">Advertisement</span>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore -- <ins> with adsbygoogle attributes isn't in the standard JSX typings */}
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
