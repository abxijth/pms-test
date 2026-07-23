import { getMentees } from "@/lib/actions"
import { createMentee } from "@/lib/actions"
import Link from "next/link"
import { Plus, ExternalLink } from "lucide-react"
import { Dropdown } from "@/components/ui/dropdown"

export const dynamic = "force-dynamic"

export default async function MenteesPage() {
  const mentees = await getMentees()

  return (
    <div className="space-y-6" style={{ color: "#e5e5e5" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-sans)" }}>Mentees</h1>
          <p className="text-sm font-mono mt-0.5" style={{ color: "#888" }}>{">"} {mentees.length} registered</p>
        </div>
        <Dropdown
          trigger={
            <button className="btn btn-primary text-sm flex items-center gap-2 font-mono">
              <Plus size={14} />
              add mentee
            </button>
          }
        >
          <form
            action={async (fd: FormData) => {
              "use server"
              await createMentee({
                name: fd.get("name") as string,
                branch: (fd.get("branch") as string) || "",
                place: (fd.get("place") as string) || "",
                interests: (fd.get("interests") as string) || "",
                githubUrl: (fd.get("githubUrl") as string) || "",
                status: "active",
              })
            }}
            className="space-y-3"
          >
            <input name="name" placeholder="name" required className="input font-mono" />
            <input name="branch" placeholder="branch" className="input font-mono" />
            <input name="place" placeholder="place" className="input font-mono" />
            <input name="interests" placeholder="interests" className="input font-mono" />
            <input name="githubUrl" placeholder="github url" className="input font-mono" />
            <button type="submit" className="btn btn-primary w-full font-mono text-sm">save</button>
          </form>
        </Dropdown>
      </div>

      <div className="overflow-x-auto" style={{ border: "1px solid #333" }}>
        <table className="w-full text-sm font-mono" style={{ minWidth: 500 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333", background: "#1f1f1f" }}>
              <th className="px-4 py-2.5 font-medium" style={{ color: "#888", textAlign: "left" }}>name</th>
              <th className="px-4 py-2.5 font-medium" style={{ color: "#888", textAlign: "left" }}>branch</th>
              <th className="px-4 py-2.5 font-medium" style={{ color: "#888", textAlign: "left" }}>interests</th>
              <th className="px-4 py-2.5 font-medium" style={{ color: "#888", textAlign: "left" }}>status</th>
              <th style={{ textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {mentees.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                <td className="px-4 py-2.5">
                  <Link href={`/mentees/${m.id}`} className="font-medium" style={{ color: "#3b82f6", fontFamily: "var(--font-mono)" }}>
                    {m.name}
                  </Link>
                </td>
                <td className="px-4 py-2.5" style={{ color: "#999" }}>{m.branch || "-"}</td>
                <td className="px-4 py-2.5" style={{ color: "#999", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.interests || "-"}</td>
                <td className="px-4 py-2.5">
                  <span className={`badge font-mono ${m.status === "active" ? "badge-green" : "badge-red"}`}>{m.status}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/mentees/${m.id}`} className="btn btn-ghost btn-sm" style={{ fontFamily: "var(--font-mono)" }}>
                    <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
