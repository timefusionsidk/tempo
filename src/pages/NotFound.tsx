import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-ink dark:text-paper">404</p>
      <p className="mt-3 text-ink-soft dark:text-paper/70">This page doesn't exist. It may have been moved or the link may be off.</p>
      <Link to="/" className="mt-6 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-dim">
        Back to Tempo
      </Link>
    </div>
  )
}
