-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "DailyStatus" DROP CONSTRAINT "DailyStatus_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_taskId_fkey";

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "mentorId" TEXT;

-- AlterTable
ALTER TABLE "Mentee" ADD COLUMN     "mentorId" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "mentorId" TEXT;
