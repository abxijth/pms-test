import { getMeetings, createMeeting } from "@/lib/actions"
import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"

export const dynamic = "force-dynamic"

export default async function SessionsPage() {
  const meetings = await getMeetings()

  return (
    <div className="space-y-6" style={{ color: "#e5e5e5" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>Sessions</h1>
          <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>{">"} {meetings.length} total</p>
        </div>
        <Dropdown
          trigger={
            <button className="btn btn-primary text-sm flex items-center gap-2 font-mono">
              <Plus size={14} />
              new session
            </button>
          }
        >
          <form
            action={async (fd: FormData) => {
              "use server"
              await createMeeting({
                title: fd.get("title") as string,
                date: fd.get("date") as string,
                description: (fd.get("description") as string) || "",
              })
            }}
            className="space-y-3"
          >
            <input name="title" placeholder="session title" required className="input font-mono" />
            <input name="date" type="date" required className="input font-mono" />
            <textarea name="description" placeholder="description" rows={3} className="input font-mono" />
            <button type="submit" className="btn btn-primary w-full font-mono text-sm">create</button>
          </form>
        </Dropdown>
      </div>

      <div className="space-y-2">
        {meetings.map((m) => (
          <Link
            key={m.id}
            href={`/sessions/${m.id}`}
            className="card flex items-center justify-between session-link"
            style={{ textDecoration: "none" }}
          >
            <div>
              <p className="font-medium font-mono" style={{ color: "#e5e5e5" }}>{m.title}</p>
              <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>
                {new Date(m.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono" style={{ color: "#888" }}>
              <span>{m._count.attendance} attended</span>
              <ArrowRight size={16} style={{ color: "#666" }} />
            </div>
          </Link>
        ))}
        {meetings.length === 0 && <p className="text-sm font-mono text-center py-8" style={{ color: "#666" }}>no sessions yet</p>}
      </div>
    </div>
  )
}
