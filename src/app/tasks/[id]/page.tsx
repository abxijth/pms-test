import { getTask, getMentees, updateSubmission, updateTask, deleteTask } from "@/lib/actions"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2, RotateCcw, CheckCircle2, Send, Clock } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"

export const dynamic = "force-dynamic"

const statusCycle: Record<string, string> = { pending: "submitted", submitted: "reviewed", reviewed: "pending" }
const statusMeta: Record<string, { icon: React.ReactNode; label: string; bg: string; border: string; color: string }> = {
  pending: { icon: <Clock size={14} />, label: "pending", bg: "#422006", border: "#854d0e", color: "#fde68a" },
  submitted: { icon: <Send size={14} />, label: "submitted", bg: "#172554", border: "#1e40af", color: "#93c5fd" },
  reviewed: { icon: <CheckCircle2 size={14} />, label: "reviewed", bg: "#052e16", border: "#166534", color: "#86efac" },
}

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await getTask(Number(id))
  if (!task) notFound()

  const mentees = await getMentees()
  const submissionMap = new Map(task.submissions.map((s) => [s.menteeId, s]))

  return (
    <div className="space-y-6" style={{ color: "#e5e5e5" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/tasks" style={{ color: "#666" }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>{task.title}</h1>
            <p className="text-sm font-mono" style={{ color: "#888" }}>
              due: {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dropdown
            trigger={
              <button className="btn btn-ghost btn-sm font-mono" style={{ fontSize: 12 }}>edit</button>
            }
          >
            <form
              action={async (fd: FormData) => {
                "use server"
                await updateTask(task.id, {
                  title: fd.get("title") as string,
                  description: (fd.get("description") as string) || "",
                  dueDate: fd.get("dueDate") as string,
                })
              }}
              className="space-y-3"
            >
                <input name="title" defaultValue={task.title} required className="input font-mono" />
                <textarea name="description" defaultValue={task.description} placeholder="description" rows={3} className="input font-mono" />
                <input name="dueDate" type="date" defaultValue={task.dueDate.toISOString().split("T")[0]} required className="input font-mono" />
                <button type="submit" className="btn btn-primary w-full font-mono text-sm">save</button>
              </form>
          </Dropdown>
          <form action={async () => {
            "use server"
            await deleteTask(task.id)
            redirect("/tasks")
          }}>
            <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#ef4444" }}>
              <Trash2 size={14} />
            </button>
          </form>
        </div>
      </div>

      {task.description && (
        <div className="card">
          <p className="text-sm font-mono" style={{ color: "#bbb" }}>{task.description}</p>
        </div>
      )}

      <div className="card">
        <p className="text-sm font-mono mb-3" style={{ color: "#888" }}>{"$"} submissions</p>
        <div className="space-y-1">
          {mentees.map((mentee) => {
            const sub = submissionMap.get(mentee.id)
            const status = sub?.status ?? "pending"
            const meta = statusMeta[status]

            return (
              <div
                key={mentee.id}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-mono"
                style={{ border: "1px solid #333", background: "#1f1f1f" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                  <span style={{ color: "#e5e5e5", whiteSpace: "nowrap" }}>{mentee.name}</span>
                  {sub?.githubLink && (
                    <a href={sub.githubLink} target="_blank" style={{ color: "#3b82f6", fontSize: 11 }}>view submission</a>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs" style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}>
                    {meta.icon}{meta.label}
                  </span>
                  <form action={async () => {
                    "use server"
                    await updateSubmission(task.id, mentee.id, { status: statusCycle[status] })
                  }}>
                    <button type="submit" className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                      {status === "reviewed" ? <RotateCcw size={14} /> : status === "pending" ? "mark submitted" : "mark reviewed"}
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
