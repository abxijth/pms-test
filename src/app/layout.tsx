import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/ui/app-shell"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Praveshan Mentoring",
  description: "Mentoring session management for Praveshan",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${spaceMono.variable} antialiased`}>
      <body className="min-h-screen flex font-sans" style={{ background: "#1a1a1a", color: "#e5e5e5", margin: 0 }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
