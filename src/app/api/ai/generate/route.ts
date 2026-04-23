import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  generateBio,
  generateProjectDescription,
  generateSkills,
  generateCoverLetter,
  generateLinkedInSummary,
  generateInterviewTalkingPoints,
  generateTagline,
} from '@/lib/ai'

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

  // Reliable AI rate-limiting using dedicated User columns
  if (user.plan === 'FREE') {
    const now = new Date()
    let currentCalls = user.aiCallsThisMonth
    let resetAt = user.aiCallsResetAt

    // Reset if it's a new billing cycle (or first time)
    if (!resetAt || now >= resetAt) {
      currentCalls = 0
      resetAt = new Date(now)
      resetAt.setMonth(resetAt.getMonth() + 1)
    }

    if (currentCalls >= AI_LIMIT_FREE) {
      return NextResponse.json(
        { error: 'Free plan limit reached (5 AI calls/month). Upgrade to Pro.' },
        { status: 403 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        aiCallsThisMonth: currentCalls + 1,
        aiCallsResetAt: resetAt,
      },
    })
  }

  // Parse request body exactly once
  const {
    type,
    projects,
    skills,
    repoName,
    language,
    stars,
    jobDescription,
    project,
  } = await req.json()

  const username = user.name || user.username || 'Developer'
  const portfolioProjects = projects ?? user.portfolio?.projects ?? []
  const portfolioSkills = skills ?? user.portfolio?.skills ?? []

  try {
    // ── Existing types ──────────────────────────────────────────────────────

    if (type === 'bio') {
      const bio = await generateBio({
        username,
        projects: portfolioProjects,
        skills: portfolioSkills,
      })
      return NextResponse.json({ bio })
    }

    if (type === 'description') {
      const description = await generateProjectDescription({ repoName, language, stars })
      return NextResponse.json({ description })
    }

    if (type === 'skills') {
      const suggestedSkills = await generateSkills({ projects: portfolioProjects })
      return NextResponse.json({ skills: suggestedSkills })
    }

    if (type === 'cover-letter') {
      if (!jobDescription) {
        return NextResponse.json({ error: 'Job description is required' }, { status: 400 })
      }
      const coverLetter = await generateCoverLetter({
        username,
        projects: portfolioProjects,
        skills: portfolioSkills,
        jobDescription,
      })
      return NextResponse.json({ coverLetter })
    }

    // ── New types ───────────────────────────────────────────────────────────

    if (type === 'linkedin-summary') {
      const summary = await generateLinkedInSummary({
        username,
        projects: portfolioProjects,
        skills: portfolioSkills,
      })
      return NextResponse.json({ summary })
    }

    if (type === 'interview-points') {
      if (!project) {
        return NextResponse.json({ error: 'Project data is required' }, { status: 400 })
      }
      const points = await generateInterviewTalkingPoints({
        project,
        skills: portfolioSkills,
      })
      return NextResponse.json({ points })
    }

    if (type === 'tagline') {
      const taglines = await generateTagline({
        username,
        projects: portfolioProjects,
        skills: portfolioSkills,
      })
      return NextResponse.json({ taglines })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (err: any) {
    console.error('[ai/generate] error:', err)
    return NextResponse.json({ error: err.message ?? 'AI generation failed' }, { status: 500 })
  }
}