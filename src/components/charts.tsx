"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

const mono = { fontFamily: "var(--font-mono)", fontSize: 11 }
const muted = "#666"
const text = "#c5c5c5"

interface SessionData { name: string; present: number; total: number }
interface TaskData { name: string; submitted: number; total: number }

export function AttendanceChart({ data }: { data: SessionData[] }) {
  if (data.length === 0) return <p className="text-sm font-mono" style={{ color: muted }}>no data</p>

  return (
    <div>
      <p className="font-mono text-xs mb-2" style={{ color: "#3b82f6" }}>{">"} attendance</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap={6} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#2a2a2a" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: muted, ...mono }}
            axisLine={{ stroke: "#333" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: muted, ...mono }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Bar dataKey="present" fill="#3b82f6" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TaskChart({ data }: { data: TaskData[] }) {
  if (data.length === 0) return <p className="text-sm font-mono" style={{ color: muted }}>no data</p>

  return (
    <div>
      <p className="font-mono text-xs mb-2" style={{ color: "#22c55e" }}>{">"} submissions</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap={6} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="#2a2a2a" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: muted, ...mono }}
            axisLine={{ stroke: "#333" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: muted, ...mono }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Bar dataKey="submitted" fill="#22c55e" radius={0} />
        </BarChart>
      </ResponsiveContainer>
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
