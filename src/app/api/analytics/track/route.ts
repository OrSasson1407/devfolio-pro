import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { username, referrer } = await req.json()

    const user = await prisma.user.findUnique({
      where: { username },
      include: { portfolio: true },
    })

    if (!user?.portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    const country = req.headers.get('x-vercel-ip-country') ?? null

    await prisma.view.create({
      data: {
        portfolioId: user.portfolio.id,
        referrer: referrer ?? null,
        country,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}