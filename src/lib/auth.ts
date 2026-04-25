import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

interface UserWithUsername {
  id: string
  username?: string | null
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        }
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      session.user.username = (user as unknown as UserWithUsername).username ?? null
      return session
    },
  },
  events: {
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
      } catch (error: unknown) {
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