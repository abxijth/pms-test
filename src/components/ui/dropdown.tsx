"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"

export function Dropdown({
  trigger,
  children,
}: {
  trigger: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative" style={{ position: "relative" }}>
      <div onClick={() => setOpen((p) => !p)} style={{ cursor: "pointer" }}>
        {trigger}
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            zIndex: 50,
            background: "#222",
            border: "1px solid #333",
            borderRadius: 8,
            padding: 16,
            minWidth: 280,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
