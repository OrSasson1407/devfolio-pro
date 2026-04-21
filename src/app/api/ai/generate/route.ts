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

  // Rate limit for free users — count AI views as a proxy (simple approach)
  // In production you'd have a dedicated aiCallsThisMonth counter
  if (user.plan === 'FREE') {
    const aiCalls = await prisma.view.count({
      where: {
        portfolioId: user.portfolio?.id ?? '',
        referrer: 'ai',
      },
    })
    if (aiCalls >= AI_LIMIT_FREE) {
      return NextResponse.json(
        { error: 'Free plan limit reached (5 AI calls/month). Upgrade to Pro.' },
        { status: 403 }
      )
    }
  }

  const { type, projects, skills } = await req.json()

  try {
    if (type === 'bio') {
      const bio = await generateBio({
        username: user.username ?? user.name ?? '',
        projects: projects ?? [],
        skills: skills ?? [],
      })

      // Log AI call
      if (user.portfolio) {
        await prisma.view.create({
          data: { portfolioId: user.portfolio.id, referrer: 'ai' },
        })
      }

      return NextResponse.json({ bio })
    }

    if (type === 'description') {
      const { repoName, language, stars } = await req.json()
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