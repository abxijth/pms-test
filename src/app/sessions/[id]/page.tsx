import { getMeeting, getMentees, toggleAttendance, updateMeeting, deleteMeeting } from "@/lib/actions"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2, Check, X } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"

export const dynamic = "force-dynamic"

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const meeting = await getMeeting(Number(id))
  if (!meeting) notFound()

  const mentees = await getMentees()
  const attendanceMap = new Map(meeting.attendance.map((a) => [a.menteeId, a.status]))
  const presentCount = meeting.attendance.filter((a) => a.status === "present").length

  return (
    <div className="space-y-6" style={{ color: "#e5e5e5" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/sessions" style={{ color: "#666" }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>{meeting.title}</h1>
            <p className="text-sm font-mono" style={{ color: "#888" }}>
              {new Date(meeting.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              <span className="ml-3">{presentCount}/{mentees.length} present</span>
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
                await updateMeeting(meeting.id, {
                  title: fd.get("title") as string,
                  date: fd.get("date") as string,
                  description: (fd.get("description") as string) || "",
                  transcript: (fd.get("transcript") as string) || "",
                })
              }}
              className="space-y-3"
            >
                <input name="title" defaultValue={meeting.title} required className="input font-mono" />
                <input name="date" type="date" defaultValue={meeting.date.toISOString().split("T")[0]} required className="input font-mono" />
                <textarea name="description" defaultValue={meeting.description} placeholder="description" rows={3} className="input font-mono" />
                <textarea name="transcript" defaultValue={meeting.transcript} placeholder="transcript" rows={5} className="input font-mono" />
                <button type="submit" className="btn btn-primary w-full font-mono text-sm">save</button>
              </form>
          </Dropdown>
          <form action={async () => {
            "use server"
            await deleteMeeting(meeting.id)
            redirect("/sessions")
          }}>
            <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#ef4444" }}>
              <Trash2 size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <p className="text-sm font-mono mb-3" style={{ color: "#888" }}>{"$"} attendance</p>
        <div className="space-y-1">
          {mentees.map((mentee) => {
            const status = attendanceMap.get(mentee.id) ?? "absent"
            return (
              <form
                key={mentee.id}
                action={async () => {
                  "use server"
                  await toggleAttendance(meeting.id, mentee.id, status === "present" ? "absent" : "present")
                }}
              >
                <button
                  type="submit"
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-mono transition-colors ${status === "present" ? "attendance-present" : "attendance-absent"}`}
                  style={{
                    border: status === "present" ? "1px solid #166534" : "1px solid #333",
                    background: status === "present" ? "#052e16" : "transparent",
                    color: status === "present" ? "#86efac" : "#888",
                    cursor: "pointer",
                  }}
                >
                  <span>{mentee.name}</span>
                  {status === "present" ? <Check size={16} style={{ color: "#22c55e" }} /> : <X size={16} style={{ color: "#555" }} />}
                </button>
              </form>
            )
          })}
        </div>
      </div>

      {meeting.transcript && (
        <div className="card">
          <p className="text-sm font-mono mb-3" style={{ color: "#888" }}>{"$"} transcript</p>
          <div className="text-sm font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "#bbb" }}>{meeting.transcript}</div>
        </div>
      )}
    </div>
  )
}
