"use client"

const mono = { fontFamily: "var(--font-mono)", fontSize: 11 }
const muted = "#666"
const text = "#c5c5c5"

interface SessionData { name: string; present: number; total: number }
interface TaskData { name: string; submitted: number; total: number }

function Bar({
  pct,
  color,
  height = 14,
  radius = 3,
}: {
  pct: number
  color: string
  height?: number
  radius?: number
}) {
  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#1a1a1a",
        borderRadius: radius,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: radius,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  )
}

export function AttendanceChart({ data }: { data: SessionData[] }) {
  if (data.length === 0) return <p className="text-sm font-mono" style={{ color: muted }}>no data</p>

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs" style={{ color: "#3b82f6" }}>{">"} attendance</p>
      {data.map((s) => {
        const pct = s.total > 0 ? Math.min(Math.round((s.present / s.total) * 100), 100) : 0
        return (
          <div key={s.name} className="font-mono" style={{ fontSize: 12 }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="truncate" style={{ color: text, maxWidth: "60%" }}>{s.name}</span>
              <span style={{ color: muted, whiteSpace: "nowrap" }}>{s.present}/{s.total} ({pct}%)</span>
            </div>
            <Bar pct={pct} color="#3b82f6" />
          </div>
        )
      })}
    </div>
  )
}

export function TaskChart({ data }: { data: TaskData[] }) {
  if (data.length === 0) return <p className="text-sm font-mono" style={{ color: muted }}>no data</p>

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs" style={{ color: "#22c55e" }}>{">"} submissions</p>
      {data.map((t) => {
        const pct = t.total > 0 ? Math.min(Math.round((t.submitted / t.total) * 100), 100) : 0
        return (
          <div key={t.name} className="font-mono" style={{ fontSize: 12 }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="truncate" style={{ color: text, maxWidth: "60%" }}>{t.name}</span>
              <span style={{ color: muted, whiteSpace: "nowrap" }}>{t.submitted}/{t.total} ({pct}%)</span>
            </div>
            <Bar pct={pct} color="#22c55e" />
          </div>
        )
      })}
    </div>
  )
}

export function ProgressBar({
  value,
  max,
  label,
  color = "#3b82f6",
}: {
  value: number
  max: number
  label: string
  color?: string
}) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0

  return (
    <div className="font-mono" style={{ fontSize: 13 }}>
      <div className="flex items-center justify-between mb-1">
        <span style={{ color: muted }}>{label}</span>
        <span style={{ color: text }}>{pct}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 20,
          background: "#1a1a1a",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  )
}
