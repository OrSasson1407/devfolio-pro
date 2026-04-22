import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateBio, generateProjectDescription, generateSkills } from '@/lib/ai'

const AI_LIMIT_FREE = 5

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { portfolio: { include: { projects: true } } },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // WARNING FIX: Reliable AI rate-limiting using dedicated User columns
  if (user.plan === 'FREE') {
    const now = new Date()
    let currentCalls = user.aiCallsThisMonth
    let resetAt = user.aiCallsResetAt

    // Reset if it's a new billing cycle (or first time)
    if (!resetAt || now >= resetAt) {
      currentCalls = 0
      resetAt = new Date(now)
      resetAt.setMonth(resetAt.getMonth() + 1) // Set next reset to 1 month from now
    }

    if (currentCalls >= AI_LIMIT_FREE) {
      return NextResponse.json(
        { error: 'Free plan limit reached (5 AI calls/month). Upgrade to Pro.' },
        { status: 403 }
      )
    }

    // Increment the counter and update reset date
    await prisma.user.update({
      where: { id: user.id },
      data: {
        aiCallsThisMonth: currentCalls + 1,
        aiCallsResetAt: resetAt,
      },
    })
  }

  // BUG FIX (Carried over): Parse the request body exactly once
  const { type, projects, skills, repoName, language, stars } = await req.json()

  try {
    if (type === 'bio') {
      const bio = await generateBio({
        username: user.username ?? user.name ?? '',
        projects: projects ?? [],
        skills: skills ?? [],
      })

      // We no longer log AI views to the View table to avoid polluting analytics

      return NextResponse.json({ bio })
    }

    if (type === 'description') {
      const description = await generateProjectDescription({ repoName, language, stars })
      return NextResponse.json({ description })
    }

    if (type === 'skills') {
      const suggestedSkills = await generateSkills({ projects: projects ?? [] })
      return NextResponse.json({ skills: suggestedSkills })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (err: any) {
    console.error('[ai/generate] error:', err)
    return NextResponse.json({ error: err.message ?? 'AI generation failed' }, { status: 500 })
  }
}