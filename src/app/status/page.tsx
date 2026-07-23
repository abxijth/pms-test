import { getDailyStatuses, getMentees } from "@/lib/actions"
import { StatusList } from "@/components/status-list"

export const dynamic = "force-dynamic"

export default async function StatusPage() {
  const statuses = await getDailyStatuses()
  const mentees = await getMentees()
  const today = new Date().toISOString().split("T")[0]

  return (
    <StatusList
      statuses={statuses.map((s) => ({
        ...s,
        date: new Date(s.date),
      }))}
      mentees={mentees}
      today={today}
    />
  )
}
