"use client"

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#1a1a1a", color: "#e5e5e5" }}>
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold font-mono">something went wrong</h1>
        <p className="text-sm font-mono" style={{ color: "#ef4444" }}>{error.message}</p>
        <button onClick={unstable_retry} className="btn btn-primary font-mono text-sm">
          try again
        </button>
      </div>
    </div>
  )
}
