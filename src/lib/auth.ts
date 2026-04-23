import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Explicitly map the GitHub profile to ensure 'username' is saved
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        }
      }
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      // Pass the username from the database user to the active session
      session.user.username = (user as any).username
      return session
    },
  },
  events: {
    // NEW: Catch user creation and link the referral code!
    async createUser({ user }) {
      if (!user.id) return
      try {
        const cookieStore = await cookies()
        const refCode = cookieStore.get('devfolio_ref')?.value
        
        if (refCode) {
          await prisma.user.update({
            where: { id: user.id },
            data: { referredBy: refCode },
          })
        }
      } catch (error) {
        console.error('Failed to link referral code:', error)
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  trustHost: true,
})