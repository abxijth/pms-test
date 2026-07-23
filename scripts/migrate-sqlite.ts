import "dotenv/config"
import Database from "better-sqlite3"
import { PrismaClient } from "@prisma/client"

const sqlite = new Database("prisma/dev.db")
const prisma = new PrismaClient()

async function migrate() {
  // Clear seeded data first
  await prisma.dailyStatus.deleteMany({})
  await prisma.submission.deleteMany({})
  await prisma.attendance.deleteMany({})
  await prisma.meeting.deleteMany({})
  await prisma.task.deleteMany({})
  await prisma.mentee.deleteMany({})
  await prisma.user.deleteMany({})

  // Reset sequences
  await prisma.$executeRawUnsafe(`SELECT setval('"User_id_seq"', 1, false)`)
  await prisma.$executeRawUnsafe(`SELECT setval('"Mentee_id_seq"', 1, false)`)
  await prisma.$executeRawUnsafe(`SELECT setval('"Meeting_id_seq"', 1, false)`)
  await prisma.$executeRawUnsafe(`SELECT setval('"Task_id_seq"', 1, false)`)
  await prisma.$executeRawUnsafe(`SELECT setval('"DailyStatus_id_seq"', 1, false)`)

  // 1. Migrate mentors -> users
  let primaryUserId: string | null = null
  const mentors = sqlite.prepare("SELECT * FROM Mentor").all() as any[]
  for (const m of mentors) {
    const user = await prisma.user.create({
      data: {
        name: m.name,
        role: m.role,
        color: m.color,
        email: m.name === "Abhijth" ? "abhijithrpillai231@gmail.com" : null,
      },
    })
    if (m.role === "primary") primaryUserId = user.id
  }

  // 2. Migrate sessions -> meetings (track old->new id mapping)
  const sessions = sqlite.prepare("SELECT * FROM Session").all() as any[]
  const meetingIdMap = new Map<number, number>()
  for (const s of sessions) {
    const created = await prisma.meeting.create({
      data: {
        date: new Date(s.date),
        title: s.title,
        description: s.description ?? "",
        transcript: s.transcript ?? "",
        mentorId: primaryUserId!,
      },
    })
    meetingIdMap.set(s.id, created.id)
  }

  // 3. Migrate mentees
  const mentees = sqlite.prepare("SELECT * FROM Mentee").all() as any[]
  const menteeIdMap = new Map<number, number>()
  for (const m of mentees) {
    const created = await prisma.mentee.create({
      data: {
        name: m.name,
        branch: m.branch ?? "",
        place: m.place ?? "",
        interests: m.interests ?? "",
        githubUrl: m.githubUrl ?? "",
        status: m.status ?? "active",
        mentorId: primaryUserId!,
      },
    })
    menteeIdMap.set(m.id, created.id)
  }

  // 4. Migrate attendance (map old sessionId -> new meetingId)
  const attendance = sqlite.prepare("SELECT * FROM Attendance").all() as any[]
  for (const a of attendance) {
    const newMeetingId = meetingIdMap.get(a.sessionId)
    const newMenteeId = menteeIdMap.get(a.menteeId)
    if (newMeetingId && newMenteeId) {
      await prisma.attendance.create({
        data: {
          meetingId: newMeetingId,
          menteeId: newMenteeId,
          status: a.status ?? "absent",
        },
      })
    }
  }

  // 5. Migrate tasks
  const tasks = sqlite.prepare("SELECT * FROM Task").all() as any[]
  const taskIdMap = new Map<number, number>()
  for (const t of tasks) {
    const created = await prisma.task.create({
      data: {
        title: t.title,
        description: t.description ?? "",
        dueDate: new Date(t.dueDate ?? Date.now()),
        mentorId: primaryUserId!,
      },
    })
    taskIdMap.set(t.id, created.id)
  }

  // 6. Migrate submissions
  const submissions = sqlite.prepare("SELECT * FROM Submission").all() as any[]
  for (const s of submissions) {
    const newTaskId = taskIdMap.get(s.taskId)
    const newMenteeId = menteeIdMap.get(s.menteeId)
    if (newTaskId && newMenteeId) {
      await prisma.submission.create({
        data: {
          taskId: newTaskId,
          menteeId: newMenteeId,
          status: s.status ?? "pending",
          githubLink: s.githubLink ?? "",
          notes: s.notes ?? "",
          updatedAt: new Date(s.updatedAt ?? Date.now()),
        },
      })
    }
  }

  // 7. Migrate daily statuses
  const statuses = sqlite.prepare("SELECT * FROM DailyStatus").all() as any[]
  for (const s of statuses) {
    const newMenteeId = menteeIdMap.get(s.menteeId)
    if (newMenteeId) {
      await prisma.dailyStatus.create({
        data: {
          menteeId: newMenteeId,
          date: new Date(s.date ?? Date.now()),
          workDone: s.workDone ?? "",
          workPlanned: s.workPlanned ?? "",
          blockers: s.blockers ?? "",
          hoursWorked: s.hoursWorked ?? 0,
          tags: s.tags ?? "",
        },
      })
    }
  }

  console.log("Migration complete!")
}

migrate()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
