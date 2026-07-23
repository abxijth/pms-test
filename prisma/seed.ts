import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"

const prisma = new PrismaClient()

async function main() {
  const existingMentees = await prisma.mentee.count()
  if (existingMentees > 0) {
    console.log("Database already seeded.")
    return
  }

  await prisma.user.createMany({
    data: [
      { name: "Abhijth", role: "primary", color: "#6366f1", email: "abhijithrpillai231@gmail.com" },
      { name: "Nishta", role: "senior", color: "#ec4899" },
      { name: "Khushal", role: "senior", color: "#14b8a6" },
    ],
  })

  const mentees = [
    { name: "Akshath", branch: "CSE", place: "", interests: "" },
    { name: "Archana Anilkumar", branch: "", place: "", interests: "" },
    { name: "Ashwika R Nair", branch: "", place: "", interests: "reading, quora, drawing" },
    { name: "Bhargava Janupala", branch: "", place: "", interests: "" },
    { name: "Dheeraj", branch: "", place: "", interests: "pokemon, talking and meeting with people, interested in comparison of mobile processors and desktop gpus" },
    { name: "Dinesh", branch: "", place: "", interests: "" },
    { name: "Joel", branch: "", place: "", interests: "" },
    { name: "Navneeth Krishnan", branch: "", place: "", interests: "" },
    { name: "Padmini G S", branch: "", place: "", interests: "badminton, school projects - share market, chatbot" },
    { name: "R K Navaneeth", branch: "", place: "", interests: "football, watch sports" },
    { name: "Rita Edward", branch: "", place: "", interests: "" },
    { name: "Saii Krishna", branch: "", place: "", interests: "athletics, basketball, emerging tech" },
    { name: "Sarah", branch: "", place: "", interests: "" },
    { name: "Sree Parvathy R", branch: "", place: "", interests: "dancing" },
    { name: "Udaya", branch: "", place: "", interests: "" },
  ]

  for (const m of mentees) {
    await prisma.mentee.create({ data: m })
  }

  const session = await prisma.meeting.create({
    data: {
      date: new Date("2026-07-20"),
      title: "Introductory Meeting",
      description: "First meeting - introductions, expectations, and overview of the program.",
      transcript: `Hi all, Myself Abhijth, and i will be your primary mentor this time. Im from kollam, and im currently pursuing my 2nd year of B.Tech in CSE AI branch.

Along with me, we have two senior mentors, Nishta Didi and Khushal bhaiyya.

So before we get into anything, this will be a short introductory meeting, so let's do a quick round of introductions. Just your name, branch, place, and maybe one or two things you are interested in - could be tech, could be anything.

First thing, we need everyone to be active in the discord server, we need everyone to start posting daily status updates on Discord. Every day drop a message in the channel in a particular format.

Next, I need everyone to maintain a GithHub repository for your praveshan tasks. So basically you guys need to make a repository including a README.md file in the root directory. In that README, write a short intro about yourself.

Then create separate folders for each task, named by their task numbers. Inside each task folder, you would have to submit your solutions and also add a README.md explaining how you approached the task.

This club isn't just about coding - we have FOSS Play (weekend games) and FOSS Talk (public speaking) activities.`,
    },
  })

  const presentMentees = ["Ashwika R Nair", "Dheeraj", "Padmini G S", "R K Navaneeth", "Rita Edward", "Saii Krishna", "Sree Parvathy R"]
  const allMentees = await prisma.mentee.findMany()

  for (const mentee of allMentees) {
    await prisma.attendance.create({
      data: {
        meetingId: session.id,
        menteeId: mentee.id,
        status: presentMentees.includes(mentee.name) ? "present" : "absent",
      },
    })
  }

  const task = await prisma.task.create({
    data: {
      title: "Task 1: Introduction & Setup",
      description: "Create a GitHub repository with a README.md introducing yourself. Include your background, why you want to join FOSS, and what motivates you.",
      dueDate: new Date("2026-07-27"),
    },
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
