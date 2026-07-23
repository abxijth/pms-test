import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return user.email === "abhijithrpillai231@gmail.com"
    },
    authorized({ request, auth: session }) {
      const { pathname } = request.nextUrl
      if (pathname === "/login" || pathname.startsWith("/api/auth")) return true
      return !!session?.user
    },
  },
  pages: {
    signIn: "/login",
  },
})
