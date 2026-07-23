import { getDashboardStats } from "@/lib/actions"
import { AttendanceChart, TaskChart, ProgressBar } from "@/components/charts"
import { Users, Calendar, ClipboardList, Percent } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#e5e5e5" }}>Dashboard</h1>
        <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>
          {">"} {stats.activeMentees} active / {stats.droppedCount} dropped / {stats.menteeCount} total
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card" style={{ borderLeft: "3px solid #3b82f6" }}>
          <div className="flex items-center gap-3">
            <Users size={18} style={{ color: "#3b82f6" }} />
            <div>
              <p className="text-2xl font-semibold" style={{ color: "#e5e5e5" }}>{stats.activeMentees}</p>
              <p className="text-xs font-mono" style={{ color: "#888" }}>active mentees</p>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderLeft: "3px solid #22c55e" }}>
          <div className="flex items-center gap-3">
            <Calendar size={18} style={{ color: "#22c55e" }} />
            <div>
              <p className="text-2xl font-semibold" style={{ color: "#e5e5e5" }}>{stats.sessionCount}</p>
              <p className="text-xs font-mono" style={{ color: "#888" }}>sessions</p>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderLeft: "3px solid #a855f7" }}>
          <div className="flex items-center gap-3">
            <ClipboardList size={18} style={{ color: "#a855f7" }} />
            <div>
              <p className="text-2xl font-semibold" style={{ color: "#e5e5e5" }}>{stats.taskCount}</p>
              <p className="text-xs font-mono" style={{ color: "#888" }}>tasks</p>
            </div>
          </div>
        </div>
        <div className="card" style={{ borderLeft: "3px solid #f59e0b" }}>
          <div className="flex items-center gap-3">
            <Percent size={18} style={{ color: "#f59e0b" }} />
            <div>
              <p className="text-2xl font-semibold" style={{ color: "#e5e5e5" }}>{stats.attendanceRate}%</p>
              <p className="text-xs font-mono" style={{ color: "#888" }}>attendance rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-mono text-xs mb-3" style={{ color: "#3b82f6" }}>
            {"#"} attendance
          </div>
          <AttendanceChart data={stats.sessionChartData} />
        </div>
        <div className="card">
          <div className="font-mono text-xs mb-3" style={{ color: "#22c55e" }}>
            {"#"} task submissions
          </div>
          <TaskChart data={stats.taskChartData} />
        </div>
      </div>

      <div className="card">
        <div className="font-mono text-xs mb-3" style={{ color: "#f59e0b" }}>
          {"#"} progress
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProgressBar
            value={stats.attendanceRate}
            max={100}
            label="attendance"
            color="#3b82f6"
          />
          <ProgressBar
            value={stats.submissionRate}
            max={100}
            label="submissions"
            color="#22c55e"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-mono text-xs mb-3" style={{ color: "#888" }}>
            {"$"} recent sessions
          </div>
          {stats.recentSessions.length === 0 ? (
            <p className="text-sm font-mono" style={{ color: "#666" }}>none</p>
          ) : (
            <div className="space-y-1.5">
              {stats.recentSessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <div>
                    <p className="text-sm font-mono" style={{ color: "#e5e5e5" }}>{s.title}</p>
                    <p className="text-xs font-mono" style={{ color: "#666" }}>
                      {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className="badge badge-gray font-mono">{s.attendance?.length || 0} present</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <div className="font-mono text-xs mb-3" style={{ color: "#888" }}>
            {"$"} recent status
          </div>
          {stats.recentStatuses.length === 0 ? (
            <p className="text-sm font-mono" style={{ color: "#666" }}>none</p>
          ) : (
            <div className="space-y-1.5">
              {stats.recentStatuses.map((s) => (
                <div key={s.id} className="py-1" style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono" style={{ color: "#e5e5e5" }}>{s.mentee.name}</p>
                    <div className="flex items-center gap-2">
                      {s.hoursWorked > 0 && <span className="text-xs font-mono" style={{ color: "#f59e0b" }}>{s.hoursWorked}h</span>}
                      <span className="text-xs font-mono" style={{ color: "#666" }}>
                        {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-mono mt-0.5 truncate" style={{ color: "#999" }}>{s.workDone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
