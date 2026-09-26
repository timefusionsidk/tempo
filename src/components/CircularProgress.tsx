interface CircularProgressProps {
  /** 0 to 1. */
  progress: number
  size?: number
  strokeWidth?: number
  tone?: 'default' | 'complete'
  children?: React.ReactNode
}

export default function CircularProgress({
  progress,
  size = 280,
  strokeWidth = 10,
  tone = 'default',
  children
}: CircularProgressProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, progress))
  const offset = circumference * (1 - clamped)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-line dark:stroke-line-dark"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={tone === 'complete' ? 'stroke-signal-bright transition-[stroke-dashoffset] duration-200' : 'stroke-signal transition-[stroke-dashoffset] duration-200'}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
