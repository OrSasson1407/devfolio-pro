import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      bio, 
      skills, 
      theme, 
      openToWork, 
      contactEmail,
      twitter,
      linkedin,
      github,
      website,
      customSections, 
      projects 
    } = await req.json()

    // Validate portfolio exists first to avoid Prisma throwing unhandled errors
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
    })

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found. Please sync with GitHub first.' },
        { status: 404 }
      )
    }

    const portfolio = await prisma.portfolio.update({
      where: { id: existingPortfolio.id },
      data: { 
        bio, 
        skills, 
        theme, 
        openToWork, 
        contactEmail,
        twitter,
        linkedin,
        github,
        website,
        customSections 
      },
    })

    // Validate project ownership to prevent authorization bypass risk
    if (projects && Array.isArray(projects)) {
      for (const p of projects) {
        await prisma.project.updateMany({
          where: {
            id: p.id,
            portfolioId: portfolio.id, 
          },
          data: { order: p.order, featured: p.featured, demoUrl: p.demoUrl }, // NEW: Save demoUrl
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[portfolio/update] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}