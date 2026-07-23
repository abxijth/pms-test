"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded"
      style={{
        color: "#888",
        background: "transparent",
        border: "1px solid #333",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1f1f1f"
        e.currentTarget.style.color = "#ef4444"
        e.currentTarget.style.borderColor = "#ef4444"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent"
        e.currentTarget.style.color = "#888"
        e.currentTarget.style.borderColor = "#333"
      }}
    >
      <LogOut size={12} />
      sign out
    </button>
  )
}
