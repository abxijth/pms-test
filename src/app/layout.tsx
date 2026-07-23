import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/ui/sidebar"
import { SignOutButton } from "@/components/ui/sign-out"

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
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-end p-3" style={{ borderBottom: "1px solid #222" }}>
            <SignOutButton />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </body>
    </html>
  )
}
