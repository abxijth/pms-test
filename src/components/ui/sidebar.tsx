"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mentees", label: "Mentees", icon: Users },
  { href: "/sessions", label: "Sessions", icon: Calendar },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/status", label: "Daily Status", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 200,
        background: "#151515",
        borderRight: "1px solid #222",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRadius: 0,
      }}
    >
      <div style={{ padding: "16px 16px", borderBottom: "1px solid #222" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#e5e5e5", fontFamily: "var(--font-sans)" }}>
          Praveshan
        </p>
        <p style={{ fontSize: 11, color: "#555", marginTop: 2, fontFamily: "var(--font-mono)" }}>
          mentoring dashboard
        </p>
      </div>
      <nav style={{ flex: 1, padding: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                fontSize: 13,
                borderRadius: 4,
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                background: isActive ? "#222" : "transparent",
                color: isActive ? "#e5e5e5" : "#666",
                transition: "background 0.1s, color 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#1f1f1f"
                  e.currentTarget.style.color = "#aaa"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#666"
                }
              }}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #333" }}></div>
    </aside>
  )
}
