export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" className="fill-signal" />
      <circle cx="32" cy="34" r="18" fill="none" stroke="#F7F5F0" strokeWidth="4" />
      <rect x="27" y="8" width="10" height="6" rx="2" fill="#F7F5F0" />
      <line x1="32" y1="34" x2="40" y2="26" stroke="#F7F5F0" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="34" r="3.2" fill="#F7F5F0" />
    </svg>
  )
}
