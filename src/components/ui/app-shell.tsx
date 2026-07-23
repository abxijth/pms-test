"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { SignOutButton } from "./sign-out"
import { Menu } from "lucide-react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out lg:relative lg:inset-y-auto lg:z-auto lg:transition-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto min-w-0">
        <div className="flex items-center justify-between p-3" style={{ borderBottom: "1px solid #222" }}>
          <button
            className="flex items-center gap-2 px-2 py-1 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            style={{ color: "#888", cursor: "pointer", background: "none", border: "none", fontSize: 13, fontFamily: "var(--font-mono)" }}
          >
            <Menu size={18} />
            menu
          </button>
          <div className="hidden lg:block" />
          <SignOutButton />
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </>
  )
}
