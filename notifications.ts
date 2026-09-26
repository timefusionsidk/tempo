import type { NotificationPermissionState } from '../types'

export function getNotificationState(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission as NotificationPermissionState
}

/** Must be called from inside a user gesture (a click), never on page load. */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  if (Notification.permission !== 'default') return Notification.permission as NotificationPermissionState
  try {
    const result = await Notification.requestPermission()
    return result as NotificationPermissionState
  } catch {
    return 'denied'
  }
}

export function notify(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      tag: 'tempo-alert',
      silent: true // Tempo plays its own synthesized alert sound; avoid doubling it up.
    })
  } catch {
    /* Some browsers (notably iOS Safari, non-installed) don't support this constructor. */
  }
}
