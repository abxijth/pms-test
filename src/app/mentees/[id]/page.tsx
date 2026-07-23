import { getMentee, updateMentee, deleteMentee } from "@/lib/actions"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"

export const dynamic = "force-dynamic"

export default async function MenteePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mentee = await getMentee(Number(id))
  if (!mentee) notFound()

  const attended = mentee.attendance.filter((a) => a.status === "present").length
  const total = mentee.attendance.length
  const rate = total > 0 ? Math.round((attended / total) * 100) : 0

  return (
    <div className="space-y-6" style={{ color: "#e5e5e5" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/mentees" style={{ color: "#666" }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>{mentee.name}</h1>
            <p className="text-sm font-mono" style={{ color: "#888" }}>{">"} mentee profile</p>
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
                await updateMentee(mentee.id, {
                  name: fd.get("name") as string,
                  branch: (fd.get("branch") as string) || "",
                  place: (fd.get("place") as string) || "",
                  interests: (fd.get("interests") as string) || "",
                  githubUrl: (fd.get("githubUrl") as string) || "",
                  status: fd.get("status") as string,
                })
              }}
              className="space-y-3"
            >
                <input name="name" defaultValue={mentee.name} required className="input font-mono" />
                <input name="branch" defaultValue={mentee.branch} placeholder="branch" className="input font-mono" />
                <input name="place" defaultValue={mentee.place} placeholder="place" className="input font-mono" />
                <input name="interests" defaultValue={mentee.interests} placeholder="interests" className="input font-mono" />
                <input name="githubUrl" defaultValue={mentee.githubUrl} placeholder="github url" className="input font-mono" />
                <select name="status" defaultValue={mentee.status} className="input font-mono">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="dropped">dropped</option>
                </select>
                <button type="submit" className="btn btn-primary w-full font-mono text-sm">save</button>
              </form>
          </Dropdown>
          <form action={async () => {
            "use server"
            await deleteMentee(mentee.id)
            redirect("/mentees")
          }}>
            <button type="submit" className="btn btn-ghost btn-sm" style={{ color: "#ef4444" }}>
              <Trash2 size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "attendance", value: `${rate}%` },
          { label: "sessions", value: `${attended}/${total}` },
          { label: "tasks", value: `${mentee.submissions.length}` },
          { label: "status", value: mentee.status, badge: true },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-2xl font-semibold" style={{ color: "#e5e5e5", fontFamily: "var(--font-sans)" }}>
              {s.badge ? <span className={`badge font-mono ${mentee.status === "active" ? "badge-green" : "badge-red"}`}>{s.value}</span> : s.value}
            </p>
            <p className="text-xs font-mono mt-0.5" style={{ color: "#888" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm font-mono mb-3" style={{ color: "#888" }}>{"$"} details</p>
          <dl className="space-y-2 text-sm font-mono">
            {[
              ["branch", mentee.branch || "-"],
              ["place", mentee.place || "-"],
              ["interests", mentee.interests || "-"],
              ["github", mentee.githubUrl],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: "1px solid #2a2a2a" }}>
                <dt style={{ color: "#888" }}>{k}</dt>
                <dd style={{ color: "#e5e5e5" }}>
                  {k === "github" && v ? (
                    <a href={v as string} target="_blank" className="inline-flex items-center gap-1" style={{ color: "#3b82f6" }}>
                      view <ExternalLink size={12} />
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="card">
          <p className="text-sm font-mono mb-3" style={{ color: "#888" }}>{"$"} recent status</p>
          {mentee.dailyStatus.length === 0 ? (
            <p className="text-sm font-mono" style={{ color: "#666" }}>none</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {mentee.dailyStatus.map((s) => (
                <div key={s.id} className="py-2" style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono" style={{ color: "#555" }}>
                      {new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                    {s.hoursWorked > 0 && (
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                        {s.hoursWorked}h
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div>
                      <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>work done</span>
                      <p className="text-sm font-mono" style={{ color: "#ccc" }}>{s.workDone}</p>
                    </div>
                    {s.workPlanned && (
                      <div>
                        <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80" }}>work planned</span>
                        <p className="text-sm font-mono" style={{ color: "#ccc" }}>{s.workPlanned}</p>
                      </div>
                    )}
                    {s.blockers && (
                      <div>
                        <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>blockers</span>
                        <p className="text-sm font-mono" style={{ color: "#ccc" }}>{s.blockers}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <p className="text-sm font-mono mb-3" style={{ color: "#888" }}>{"$"} task submissions</p>
        {mentee.submissions.length === 0 ? (
          <p className="text-sm font-mono" style={{ color: "#666" }}>none</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono" style={{ minWidth: 400 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333", background: "#1f1f1f" }}>
                <th className="px-4 py-2" style={{ color: "#888", textAlign: "left" }}>task</th>
                <th className="px-4 py-2" style={{ color: "#888", textAlign: "left" }}>status</th>
                <th className="px-4 py-2" style={{ color: "#888", textAlign: "left" }}>github</th>
                <th className="px-4 py-2" style={{ color: "#888", textAlign: "left" }}>notes</th>
              </tr>
            </thead>
            <tbody>
              {mentee.submissions.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <td className="px-4 py-2" style={{ color: "#e5e5e5" }}>{s.task.title}</td>
                  <td className="px-4 py-2">
                    <span className={`badge font-mono ${
                      s.status === "reviewed" ? "badge-green" : s.status === "submitted" ? "badge-blue" : "badge-yellow"
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    {s.githubLink ? <a href={s.githubLink} target="_blank" style={{ color: "#3b82f6" }}>link</a> : "-"}
                  </td>
                  <td className="px-4 py-2" style={{ color: "#999" }}>{s.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
