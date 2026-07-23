"use server"

import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/auth"
import sanitizeHtml from "sanitize-html"
import { checkRateLimit } from "./rate-limit"

async function requireAuth() {
  const sess = await auth()
  if (!sess?.user) throw new Error("Unauthorized")
  return sess.user
}

function sanitize(str: string): string {
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} })
}

const menteeSchema = z.object({
  name: z.string().min(1).transform(sanitize),
  branch: z.string().default("").transform(sanitize),
  place: z.string().default("").transform(sanitize),
  interests: z.string().default("").transform(sanitize),
  githubUrl: z.string().default("").transform(sanitize),
  status: z.string().default("active"),
})

export async function getMentees() {
  await requireAuth()
  return prisma.mentee.findMany({ orderBy: { name: "asc" } })
}

export async function getMentee(id: number) {
  await requireAuth()
  return prisma.mentee.findUnique({
    where: { id },
    include: {
      attendance: { include: { meeting: true } },
      submissions: { include: { task: true } },
      dailyStatus: { orderBy: { date: "desc" }, take: 20 },
    },
  })
}

export async function createMentee(data: z.infer<typeof menteeSchema>) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`create-mentee-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  const parsed = menteeSchema.parse(data)
  await prisma.mentee.create({ data: parsed })
  revalidatePath("/mentees")
  revalidatePath("/")
}

export async function updateMentee(id: number, data: z.infer<typeof menteeSchema>) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`update-mentee-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  const parsed = menteeSchema.parse(data)
  await prisma.mentee.update({ where: { id }, data: parsed })
  revalidatePath("/mentees")
  revalidatePath(`/mentees/${id}`)
  revalidatePath("/")
}

export async function deleteMentee(id: number) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`delete-mentee-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.mentee.delete({ where: { id } })
  revalidatePath("/mentees")
  revalidatePath("/")
}

export async function getMeetings() {
  await requireAuth()
  return prisma.meeting.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { attendance: true } } },
  })
}

export async function getMeeting(id: number) {
  await requireAuth()
  return prisma.meeting.findUnique({
    where: { id },
    include: {
      attendance: {
        include: { mentee: true },
      },
    },
  })
}

export async function createMeeting(data: { date: string; title: string; description?: string; transcript?: string }) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`create-meeting-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.meeting.create({
    data: {
      date: new Date(data.date),
      title: sanitize(data.title),
      description: data.description ? sanitize(data.description) : "",
      transcript: data.transcript ? sanitize(data.transcript) : "",
    },
  })
  revalidatePath("/sessions")
  revalidatePath("/")
}

export async function updateMeeting(id: number, data: { date: string; title: string; description?: string; transcript?: string }) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`update-meeting-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.meeting.update({
    where: { id },
    data: {
      date: new Date(data.date),
      title: sanitize(data.title),
      description: data.description ? sanitize(data.description) : "",
      transcript: data.transcript ? sanitize(data.transcript) : "",
    },
  })
  revalidatePath("/sessions")
  revalidatePath(`/sessions/${id}`)
  revalidatePath("/")
}

export async function deleteMeeting(id: number) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`delete-meeting-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.meeting.delete({ where: { id } })
  revalidatePath("/sessions")
  revalidatePath("/")
}

export async function toggleAttendance(meetingId: number, menteeId: number) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`toggle-attendance-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  const existing = await prisma.attendance.findUnique({
    where: { meetingId_menteeId: { meetingId, menteeId } },
  })
  if (existing) {
    const newStatus = existing.status === "present" ? "absent" : "present"
    await prisma.attendance.update({
      where: { id: existing.id },
      data: { status: newStatus },
    })
  } else {
    await prisma.attendance.create({
      data: { meetingId, menteeId, status: "present" },
    })
  }
  revalidatePath(`/sessions/${meetingId}`)
  revalidatePath("/")
}

export async function getTasks() {
  await requireAuth()
  return prisma.task.findMany({
    orderBy: { dueDate: "asc" },
    include: {
      _count: { select: { submissions: true } },
    },
  })
}

export async function getTask(id: number) {
  await requireAuth()
  return prisma.task.findUnique({
    where: { id },
    include: {
      submissions: {
        include: { mentee: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  })
}

export async function createTask(data: { title: string; description?: string; dueDate: string }) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`create-task-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.task.create({
    data: {
      title: sanitize(data.title),
      description: data.description ? sanitize(data.description) : "",
      dueDate: new Date(data.dueDate),
    },
  })
  revalidatePath("/tasks")
  revalidatePath("/")
}

export async function updateTask(id: number, data: { title: string; description?: string; dueDate: string }) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`update-task-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.task.update({
    where: { id },
    data: {
      title: sanitize(data.title),
      description: data.description ? sanitize(data.description) : "",
      dueDate: new Date(data.dueDate),
    },
  })
  revalidatePath("/tasks")
  revalidatePath(`/tasks/${id}`)
  revalidatePath("/")
}

export async function deleteTask(id: number) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`delete-task-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.task.delete({ where: { id } })
  revalidatePath("/tasks")
  revalidatePath("/")
}

export async function updateSubmission(taskId: number, menteeId: number, data: { status: string; githubLink?: string; notes?: string }) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`update-submission-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  const existing = await prisma.submission.findUnique({
    where: { taskId_menteeId: { taskId, menteeId } },
  })
  const sanitized = {
    ...data,
    githubLink: data.githubLink ? sanitize(data.githubLink) : undefined,
    notes: data.notes ? sanitize(data.notes) : undefined,
  }
  if (existing) {
    await prisma.submission.update({
      where: { id: existing.id },
      data: sanitized,
    })
  } else {
    await prisma.submission.create({
      data: { taskId, menteeId, ...sanitized },
    })
  }
  revalidatePath(`/tasks/${taskId}`)
  revalidatePath("/")
}

export async function getDailyStatuses() {
  await requireAuth()
  return prisma.dailyStatus.findMany({
    orderBy: { date: "desc" },
    take: 50,
    include: { mentee: { select: { name: true } } },
  })
}

export async function createDailyStatus(data: {
  menteeId: number
  workDone: string
  workPlanned?: string
  blockers?: string
  hoursWorked?: number
  tags?: string
  date?: string
}) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`create-status-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.dailyStatus.create({
    data: {
      menteeId: data.menteeId,
      workDone: sanitize(data.workDone),
      workPlanned: data.workPlanned ? sanitize(data.workPlanned) : "",
      blockers: data.blockers ? sanitize(data.blockers) : "",
      hoursWorked: data.hoursWorked ?? 0,
      tags: data.tags ? sanitize(data.tags) : "",
      date: data.date ? new Date(data.date) : new Date(),
    },
  })
  revalidatePath("/status")
  revalidatePath("/")
}

export async function updateDailyStatus(id: number, data: {
  workDone?: string
  workPlanned?: string
  blockers?: string
  hoursWorked?: number
  tags?: string
  date?: string
}) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`update-status-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.dailyStatus.update({
    where: { id },
    data: {
      ...(data.workDone !== undefined && { workDone: sanitize(data.workDone) }),
      ...(data.workPlanned !== undefined && { workPlanned: sanitize(data.workPlanned) }),
      ...(data.blockers !== undefined && { blockers: sanitize(data.blockers) }),
      ...(data.hoursWorked !== undefined && { hoursWorked: data.hoursWorked }),
      ...(data.tags !== undefined && { tags: sanitize(data.tags) }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
    },
  })
  revalidatePath("/status")
  revalidatePath("/")
}

export async function deleteDailyStatus(id: number) {
  const sess = await requireAuth()
  const { success } = await checkRateLimit(`delete-status-${sess.id}`)
  if (!success) throw new Error("Rate limit exceeded")

  await prisma.dailyStatus.delete({ where: { id } })
  revalidatePath("/status")
  revalidatePath("/")
}

export async function getDashboardStats() {
  await requireAuth()

  const [menteeCount, meetingCount, taskCount, activeMentees, attendance, submissions, droppedCount] = await Promise.all([
    prisma.mentee.count(),
    prisma.meeting.count(),
    prisma.task.count(),
    prisma.mentee.count({ where: { status: "active" } }),
    prisma.attendance.findMany({ select: { status: true } }),
    prisma.submission.findMany({ select: { status: true } }),
    prisma.mentee.count({ where: { status: "dropped" } }),
  ])

  const totalAttendance = attendance.length
  const presentCount = attendance.filter((a) => a.status === "present").length

  const totalSubmissions = submissions.length
  const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "reviewed").length
  const reviewedCount = submissions.filter((s) => s.status === "reviewed").length

  const meetings = await prisma.meeting.findMany({
    orderBy: { date: "asc" },
    include: {
      _count: { select: { attendance: true } },
      attendance: { where: { status: "present" } },
    },
  })

  const tasks = await prisma.task.findMany({
    orderBy: { id: "asc" },
    include: {
      _count: { select: { submissions: true } },
      submissions: { where: { status: { in: ["submitted", "reviewed"] } } },
    },
  })

  const sessionChartData = meetings.map((s) => ({
    name: s.title.length > 15 ? s.title.slice(0, 15) + "..." : s.title,
    present: s.attendance.length,
    total: s._count.attendance,
  }))

  const taskChartData = tasks.map((t) => ({
    name: t.title.length > 20 ? t.title.slice(0, 20) + "..." : t.title,
    submitted: t._count.submissions,
    total: menteeCount,
  }))

  return {
    menteeCount,
    activeMentees,
    droppedCount,
    sessionCount: meetingCount,
    taskCount,
    attendanceRate: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
    submissionRate: totalSubmissions > 0 ? Math.round((submittedCount / totalSubmissions) * 100) : 0,
    reviewedCount,
    submittedCount,
    sessionChartData,
    taskChartData,
    recentSessions: meetings.reverse().slice(0, 5),
    recentStatuses: await prisma.dailyStatus.findMany({
      orderBy: { date: "desc" },
      take: 5,
      include: { mentee: { select: { name: true } } },
    }),
  }
}
