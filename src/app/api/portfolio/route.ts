import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bio, skills, theme, projects } = await req.json()

  const portfolio = await prisma.portfolio.update({
    where: { userId: session.user.id },
    data: { bio, skills, theme },
  })

  for (const p of projects) {
    await prisma.project.update({
      where: { id: p.id },
      data: { order: p.order, featured: p.featured },
    })
  }

  return NextResponse.json({ success: true })
}