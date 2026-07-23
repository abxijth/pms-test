"use client"

import { useState } from "react"
import { Plus, Trash2, Edit3 } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"
import { createDailyStatus, updateDailyStatus, deleteDailyStatus } from "@/lib/actions"

type Status = {
  id: number
  menteeId: number
  date: Date
  workDone: string
  workPlanned: string
  blockers: string
  hoursWorked: number
  tags: string
  mentee: { name: string }
}

type Mentee = {
  id: number
  name: string
  branch: string
  place: string
  interests: string
  githubUrl: string
  status: string
}

export function StatusList({ statuses, mentees, today }: { statuses: Status[]; mentees: Mentee[]; today: string }) {
  const groups = groupByDate(statuses)
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a))
  const [activeDate, setActiveDate] = useState(dates[0] || "")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>Daily Status</h1>
          <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>{">"} {statuses.length} updates</p>
        </div>
        <Dropdown
          trigger={
            <button className="btn btn-primary text-sm flex items-center gap-2 font-mono" style={{ cursor: "pointer" }}>
              <Plus size={14} />
              log update
            </button>
          }
        >
          <form
            action={async (fd: FormData) => {
              await createDailyStatus({
                menteeId: Number(fd.get("menteeId")),
                workDone: fd.get("workDone") as string,
                workPlanned: (fd.get("workPlanned") as string) || "",
                blockers: (fd.get("blockers") as string) || "",
                hoursWorked: fd.get("hoursWorked") ? Number(fd.get("hoursWorked")) : 0,
                tags: (fd.get("tags") as string) || "",
                date: (fd.get("date") as string) || today,
              })
            }}
            className="space-y-3"
          >
            <select name="menteeId" required className="input font-mono">
              <option value="">select mentee...</option>
              {mentees.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <textarea name="workDone" placeholder="work done" rows={2} required className="input font-mono" />
            <textarea name="workPlanned" placeholder="work planned" rows={2} className="input font-mono" />
            <input name="blockers" placeholder="blockers" className="input font-mono" />
            <input name="hoursWorked" type="number" step="0.5" min="0" placeholder="hours worked" className="input font-mono" />
            <input name="tags" placeholder="tags (comma separated)" className="input font-mono" />
            <input name="date" type="date" defaultValue={today} className="input font-mono" />
            <button type="submit" className="btn btn-primary w-full font-mono text-sm">log</button>
          </form>
        </Dropdown>
      </div>

      {dates.length > 0 && (
        <div className="flex gap-1.5 flex-wrap" style={{ borderBottom: "1px solid #2a2a2a", paddingBottom: 8 }}>
          {dates.map((d) => {
            const label = new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            const count = groups[d].length
            const isActive = d === activeDate
            return (
              <button
                key={d}
                onClick={() => setActiveDate(d)}
                className="font-mono text-xs px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: isActive ? "#333" : "transparent",
                  color: isActive ? "#e5e5e5" : "#666",
                  border: isActive ? "1px solid #555" : "1px solid #2a2a2a",
                  cursor: "pointer",
                }}
              >
                {label}
                <span className="ml-1.5" style={{ color: isActive ? "#888" : "#555" }}>{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {dates.length === 0 ? (
        <p className="text-sm font-mono text-center py-8" style={{ color: "#666" }}>no updates yet</p>
      ) : (
        <div className="space-y-2">
          {groups[activeDate]?.map((s) => (
            <StatusCard key={s.id} status={s} today={today} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatusCard({ status: s, today }: { status: Status; today: string }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-medium" style={{ color: "#e5e5e5" }}>{s.mentee.name}</span>
              {s.hoursWorked > 0 && (
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                  {s.hoursWorked}h
                </span>
              )}
            </div>
            <span className="text-xs font-mono shrink-0" style={{ color: "#555" }}>
              {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="grid gap-2">
            <div>
              <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>work done</span>
              <p className="text-sm font-mono leading-relaxed" style={{ color: "#ccc" }}>{s.workDone}</p>
            </div>
            {s.workPlanned && (
              <div>
                <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>work planned</span>
                <p className="text-sm font-mono leading-relaxed" style={{ color: "#ccc" }}>{s.workPlanned}</p>
              </div>
            )}
            {s.blockers && (
              <div>
                <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>blockers</span>
                <p className="text-sm font-mono leading-relaxed" style={{ color: "#ccc" }}>{s.blockers}</p>
              </div>
            )}
          </div>

          {s.tags && (
            <div className="flex gap-1.5 flex-wrap">
              {s.tags.split(",").filter(Boolean).map((tag, i) => (
                <span key={i} className="badge badge-gray font-mono text-[11px]">{tag.trim()}</span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start gap-1 shrink-0 pt-1">
          <Dropdown
            trigger={
              <button className="btn btn-ghost btn-sm" style={{ color: "#888" }}>
                <Edit3 size={13} />
              </button>
            }
          >
            <form
              action={async (fd: FormData) => {
                await updateDailyStatus(s.id, {
                  workDone: fd.get("edit_workDone") as string,
                  workPlanned: (fd.get("edit_workPlanned") as string) || "",
                  blockers: (fd.get("edit_blockers") as string) || "",
                  hoursWorked: fd.get("edit_hoursWorked") ? Number(fd.get("edit_hoursWorked")) : 0,
                  tags: (fd.get("edit_tags") as string) || "",
                  date: (fd.get("edit_date") as string) || today,
                })
              }}
              className="space-y-3"
            >
              <textarea name="edit_workDone" defaultValue={s.workDone} rows={2} required className="input font-mono" placeholder="work done" />
              <textarea name="edit_workPlanned" defaultValue={s.workPlanned} rows={2} className="input font-mono" placeholder="work planned" />
              <input name="edit_blockers" defaultValue={s.blockers} placeholder="blockers" className="input font-mono" />
              <input name="edit_hoursWorked" type="number" step="0.5" min="0" defaultValue={s.hoursWorked || ""} placeholder="hours worked" className="input font-mono" />
              <input name="edit_tags" defaultValue={s.tags} placeholder="tags (comma separated)" className="input font-mono" />
              <input name="edit_date" type="date" defaultValue={new Date(s.date).toISOString().split("T")[0]} className="input font-mono" />
              <button type="submit" className="btn btn-primary w-full font-mono text-sm">save</button>
            </form>
          </Dropdown>

          <form
            action={async () => {
              await deleteDailyStatus(s.id)
            }}
          >
            <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#ef4444" }}>
              <Trash2 size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function groupByDate(statuses: Status[]): Record<string, Status[]> {
  const groups: Record<string, Status[]> = {}
  for (const s of statuses) {
    const key = new Date(s.date).toISOString().split("T")[0]
    if (!groups[key]) groups[key] = []
    groups[key].push(s)
  }
  return groups
}
