import type { Preset } from '../types'

/** These built-in presets are always available and cannot be deleted. */
export const BUILT_IN_PRESETS: Preset[] = [1, 3, 5, 10, 15, 25, 30, 45, 60].map((mins) => ({
  id: `builtin-${mins}`,
  label: `${mins} min`,
  ms: mins * 60_000
}))
