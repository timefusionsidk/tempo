import type { SoundId } from '../types'

/**
 * Tempo's alert sounds are synthesized with the Web Audio API rather than
 * shipped as audio files. That keeps the app lightweight, keeps every sound
 * available offline immediately, and avoids licensing concerns entirely.
 */

let ctx: AudioContext | null = null
let unlocked = false

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  return ctx
}

/**
 * Browsers suspend new AudioContexts until a user gesture occurs. Call this
 * once, anywhere inside a click/tap handler (e.g. "Start"), so a completion
 * sound that fires later — with no gesture of its own — is still allowed to
 * play.
 */
export function unlockAudio() {
  const c = getContext()
  if (!c || unlocked) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {
      /* ignore */
    })
  }
  unlocked = true
}

interface Tone {
  freq: number
  start: number
  duration: number
  type?: OscillatorType
  gain?: number
}

const PATTERNS: Record<Exclude<SoundId, 'none'>, Tone[]> = {
  chime: [
    { freq: 880, start: 0, duration: 0.28, type: 'sine', gain: 0.55 },
    { freq: 1108.73, start: 0.14, duration: 0.32, type: 'sine', gain: 0.5 },
    { freq: 1318.51, start: 0.3, duration: 0.5, type: 'sine', gain: 0.45 }
  ],
  bell: [
    { freq: 587.33, start: 0, duration: 0.9, type: 'triangle', gain: 0.5 },
    { freq: 1174.66, start: 0, duration: 0.6, type: 'sine', gain: 0.25 },
    { freq: 587.33, start: 0.55, duration: 0.7, type: 'triangle', gain: 0.35 }
  ],
  digital: [
    { freq: 1046.5, start: 0, duration: 0.09, type: 'square', gain: 0.3 },
    { freq: 1046.5, start: 0.14, duration: 0.09, type: 'square', gain: 0.3 },
    { freq: 1318.51, start: 0.28, duration: 0.16, type: 'square', gain: 0.3 }
  ],
  soft: [
    { freq: 523.25, start: 0, duration: 0.5, type: 'sine', gain: 0.4 },
    { freq: 659.25, start: 0.28, duration: 0.6, type: 'sine', gain: 0.35 }
  ]
}

function playTone(c: AudioContext, tone: Tone, volume: number, atTime: number) {
  const osc = c.createOscillator()
  const gainNode = c.createGain()
  osc.type = tone.type ?? 'sine'
  osc.frequency.value = tone.freq

  const peak = Math.max(0, Math.min(1, volume)) * (tone.gain ?? 0.5)
  const t0 = atTime + tone.start
  const t1 = t0 + tone.duration

  gainNode.gain.setValueAtTime(0, t0)
  gainNode.gain.linearRampToValueAtTime(peak, t0 + 0.015)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, t1)

  osc.connect(gainNode)
  gainNode.connect(c.destination)
  osc.start(t0)
  osc.stop(t1 + 0.05)
}

/** Plays one sound once. Returns false if audio is unavailable or muted. */
export function playAlert(sound: SoundId, volume: number): boolean {
  if (sound === 'none' || volume <= 0) return false
  const c = getContext()
  if (!c) return false
  if (c.state === 'suspended') c.resume().catch(() => {})
  const now = c.currentTime
  PATTERNS[sound].forEach((tone) => playTone(c, tone, volume, now))
  return true
}

/** Plays the alert on a loop until stopped — used for the completion banner. */
export function startAlertLoop(sound: SoundId, volume: number, intervalMs = 1600): () => void {
  if (sound === 'none' || volume <= 0) return () => {}
  playAlert(sound, volume)
  const id = window.setInterval(() => playAlert(sound, volume), intervalMs)
  return () => window.clearInterval(id)
}

export const SOUND_LABELS: Record<SoundId, string> = {
  chime: 'Chime',
  bell: 'Bell',
  digital: 'Digital',
  soft: 'Soft',
  none: 'None (silent)'
}
