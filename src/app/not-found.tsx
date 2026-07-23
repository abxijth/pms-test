import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#1a1a1a", color: "#e5e5e5" }}>
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold font-mono">404</h1>
        <p className="text-sm font-mono" style={{ color: "#888" }}>page not found</p>
        <Link href="/" className="btn btn-primary font-mono text-sm inline-block" style={{ textDecoration: "none" }}>
          go home
        </Link>
      </div>
    </div>
  )
}
