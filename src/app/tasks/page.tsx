import { getTasks, getMentees, createTask } from "@/lib/actions"
import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  const tasks = await getTasks()
  const mentees = await getMentees()

  return (
    <div className="space-y-6" style={{ color: "#e5e5e5" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>Tasks</h1>
          <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>{">"} {tasks.length} tasks</p>
        </div>
        <Dropdown
          trigger={
            <button className="btn btn-primary text-sm flex items-center gap-2 font-mono">
              <Plus size={14} />
              new task
            </button>
          }
        >
          <form
            action={async (fd: FormData) => {
              "use server"
              await createTask({
                title: fd.get("title") as string,
                description: (fd.get("description") as string) || "",
                dueDate: fd.get("dueDate") as string,
              })
            }}
            className="space-y-3"
          >
            <input name="title" placeholder="task title" required className="input font-mono" />
            <textarea name="description" placeholder="description" rows={3} className="input font-mono" />
            <input name="dueDate" type="date" required className="input font-mono" />
            <button type="submit" className="btn btn-primary w-full font-mono text-sm">create</button>
          </form>
        </Dropdown>
      </div>

      <div className="space-y-2">
        {tasks.map((t) => (
          <Link
            key={t.id}
            href={`/tasks/${t.id}`}
            className="card flex items-center justify-between task-link"
            style={{ textDecoration: "none" }}
          >
            <div>
              <p className="font-medium font-mono" style={{ color: "#e5e5e5" }}>{t.title}</p>
              <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>
                due: {new Date(t.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono" style={{ color: "#888" }}>
              <span>{t._count.submissions}/{mentees.length} submitted</span>
              <ArrowRight size={16} style={{ color: "#666" }} />
            </div>
          </Link>
        ))}
        {tasks.length === 0 && <p className="text-sm font-mono text-center py-8" style={{ color: "#666" }}>no tasks yet</p>}
      </div>
    </div>
  )
}
